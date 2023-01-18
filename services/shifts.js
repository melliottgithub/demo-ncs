const { query } = require('./db');
const { parseDate, getElapsedMinutes } = require('./utils');

const MAX_OVERLAP_MIN = 0;
const SAME_FACILITY_MAX_OVERLAP_MIN = 30;

function getMaxOverlapMinutes (shift1, shift2) {
    if (shift1.facility_id === shift2.facility_id) {
        return SAME_FACILITY_MAX_OVERLAP_MIN;
    }
    return MAX_OVERLAP_MIN;
}

function getEndDate (shift) {
    const startDate = parseDate(shift.shift_date.toISOString(), shift.start_time);
    const endDate = parseDate(shift.shift_date.toISOString(), shift.end_time);
    const endsNextDay = endDate.getTime() < startDate.getTime();
    if (endsNextDay) {
        endDate.setDate(endDate.getDate() + 1);
    }
    return endDate;
}

async function getShifts (excludes) {
    const excludesFacilities = excludes?.split(',').indexOf('facilities') >= 0;
    const sql = excludesFacilities
        ? 'select s.* from question_one_shifts s order by s.shift_id'
        : 'select s.*, f.facility_name \
    from question_one_shifts s \
    inner join facilities f on f.facility_id = s.facility_id \
    order by s.shift_id';
    const results = await query(sql);
    return results.rows;
}

async function getShiftsOverlap (shift1Id, shift2Id) {
    const sql = 'select * from question_one_shifts \
  where shift_id in ($1, $2) \
  order by shift_date, start_time';
    const results = await query(sql, [shift1Id, shift2Id]);
    if (results.rows.length !== 2) {
        throw new Error('Invalid shift ids');
    }
    const [shift1, shift2] = results.rows;

    const maxOverlapMinutes = getMaxOverlapMinutes(shift1, shift2);
    const endDate = getEndDate(shift1);
    const startDate = parseDate(shift2.shift_date.toISOString(), shift2.start_time);
    const overlapMinutes = getElapsedMinutes(endDate, startDate);

    return {
        shift1_id: shift1.shift_id,
        shift2_id: shift2.shift_id,
        overlap_minutes: Math.max(0, overlapMinutes),
        max_overlap_minutes: maxOverlapMinutes,
        exceeds_overlap_threshold: overlapMinutes > maxOverlapMinutes
    };
}

async function getRemainingSpots () {
    const sql = 'select j.facility_id, j.nurse_type_needed, \
    SUM(j.total_number_nurses_needed - coalesce(hired.nurse_hired_count,0)) as remaining_spots \
    from jobs j \
    left join ( \
    select h.job_id, count(h.nurse_id) nurse_hired_count \
    from nurse_hired_jobs h \
    group by h.job_id   \
    ) hired \
    on j.job_id = hired.job_id \
    group by j.facility_id, j.nurse_type_needed \
    order by j.facility_id, j.nurse_type_needed';
    const results = await query(sql);
    return results.rows;
}

async function getMatchingJobs () {
    const sql = 'select n.nurse_id, n.nurse_name, n.nurse_type, \
  available_jobs.remaining_spots matching_jobs \
  from nurses n \
  inner join ( \
      select j.nurse_type_needed, \
      SUM(j.total_number_nurses_needed - coalesce(hired.nurse_hired_count,0)) as remaining_spots \
      from jobs j \
      left join ( \
      select h.job_id, count(h.nurse_id) nurse_hired_count \
      from nurse_hired_jobs h \
      group by h.job_id \
      ) hired \
      on j.job_id = hired.job_id \
      group by j.nurse_type_needed \
  ) available_jobs \
  on n.nurse_type = available_jobs.nurse_type_needed \
  where available_jobs.remaining_spots > 0 \
  and (n.nurse_id, n.nurse_type) not in ( \
      select h.nurse_id, j.nurse_type_needed \
      from nurse_hired_jobs h \
      inner join jobs j \
      on h.job_id = j.job_id \
  ) \
  order by n.nurse_id';
    const results = await query(sql);
    return results.rows;
}

async function getCoWorkers (nurseId) {
    const sql = 'select distinct n.nurse_name, n.nurse_type \
  from nurses n \
  inner join nurse_hired_jobs h \
  on n.nurse_id = h.nurse_id \
  inner join jobs j \
  on h.job_id = j.job_id \
  where j.facility_id in ( \
      select j.facility_id \
      from nurse_hired_jobs h \
      inner join jobs j \
      on h.job_id = j.job_id \
      where h.nurse_id = $1 \
  ) and n.nurse_id <> $1';
    const results = await query(sql, [nurseId]);
    return results.rows;
}

async function getNurses () {
    const sql = 'select n.nurse_id, n.nurse_name \
  from nurses n \
  order by n.nurse_name';
    const results = await query(sql);
    return results.rows;
}

module.exports = { getShifts, getShiftsOverlap, getRemainingSpots, getMatchingJobs, getCoWorkers, getNurses };
