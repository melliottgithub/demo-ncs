select j.facility_id, j.nurse_type_needed,
SUM(j.total_number_nurses_needed - coalesce(hired.nurse_hired_count,0)) as remaining_spots
from jobs j
left join (
select h.job_id, count(h.nurse_id) nurse_hired_count
from nurse_hired_jobs h
group by h.job_id  
) hired
on j.job_id = hired.job_id
group by j.facility_id, j.nurse_type_needed
order by j.facility_id, j.nurse_type_needed;

// verfication
select *
from jobs j
where j.facility_id=101 and j.nurse_type_needed='CNA';


select h.job_id, count(h.nurse_id)
from nurse_hired_jobs h
where h.job_id=207
group by h.job_id;