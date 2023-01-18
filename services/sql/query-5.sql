
select n.nurse_id, n.nurse_name, n.nurse_type, 
available_jobs.remaining_spots matching_jobs
from nurses n
inner join (
    select j.nurse_type_needed,
    SUM(j.total_number_nurses_needed - coalesce(hired.nurse_hired_count,0)) as remaining_spots
    from jobs j
    left join (
    select h.job_id, count(h.nurse_id) nurse_hired_count
    from nurse_hired_jobs h
    group by h.job_id  
    ) hired
    on j.job_id = hired.job_id
    group by j.nurse_type_needed
) available_jobs
on n.nurse_type = available_jobs.nurse_type_needed
where available_jobs.remaining_spots > 0
and (n.nurse_id, n.nurse_type) not in (
    select h.nurse_id, j.nurse_type_needed
    from nurse_hired_jobs h
    inner join jobs j
    on h.job_id = j.job_id
)
order by n.nurse_id;

// verification
select *
from nurses n
where n.nurse_id=1010;

select *
from nurse_hired_jobs
where nurse_id=1010;
