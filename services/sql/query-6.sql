select n.nurse_name, n.nurse_type
from nurses n
inner join nurse_hired_jobs h
on n.nurse_id = h.nurse_id
inner join jobs j
on h.job_id = j.job_id
where j.facility_id in (
    select j.facility_id
    from nurse_hired_jobs h
    inner join jobs j
    on h.job_id = j.job_id
    where h.nurse_id = 1001
)
and n.nurse_id <> 1001;

-- can be multple facilities for a nurse
select h.nurse_id, j.facility_id, count(*)
from nurse_hired_jobs h
inner join jobs j
on h.job_id = j.job_id
group by h.nurse_id, j.facility_id;

select j.facility_id
from nurse_hired_jobs h
inner join jobs j
on h.job_id = j.job_id
where h.nurse_id = 1004;

select n.nurse_name, n.nurse_type, j.facility_id
from nurses n
inner join nurse_hired_jobs h
on n.nurse_id = h.nurse_id
inner join jobs j
on h.job_id = j.job_id
where j.facility_id =101;
