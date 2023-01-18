import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RestService from "../services";
import Button from "../widgets/button";
import Card from "../widgets/card";
import Flex from "../widgets/flex";
import Select from "../widgets/select";
import Table from "../widgets/table";

const reports: Record<string, (params: any) => Promise<any>> = {
  'remaining-spots': () => RestService.getRemainingSpots(),
  'matching-jobs': () => RestService.getMatchingJobs(),
  'coworkers': (nurseId: number) => RestService.getCoWorkers(nurseId),
};

export default function Query() {
  const { name } = useParams();
  const navigate = useNavigate();
  const [nurses, setNurses] = useState<Record<string, any>[]>();
  const [nurseId, setNurseId] = useState<number|undefined>();
  const [results, setResults] = useState<Record<string, any>[]>();

  const goBack = () => {
    navigate(`/`);
  }

  const onItemSelect = (key: string) => {
    setNurseId(Number.parseInt(key));
  }

  useEffect(() => {
    if (name) {
      const report = reports[name];
      if (name === 'coworkers') {
        if (nurseId && nurseId > 0) {
          report(nurseId).then(results => {
            setResults(results as unknown as Record<string, any>[]);
          });
        }
      } else {
        report(undefined).then(results => {
          setResults(results as unknown as Record<string, any>[]);
        });
      }
    } else {
      setResults(undefined);
    }
  }, [name, nurseId]);

  useEffect(() => {
    RestService.getNurses()
      .then(results => setNurses(results as unknown as Record<string, any>[]));
  }, []);

  const columnNames = results && results.length > 0 ? Object.keys(results[0]) : [];
  const options = nurses?.map(nurse => ({
    label: nurse.nurse_name,
    value: nurse.nurse_id.toString()
  })) || [];
  return (
    <Card>
      <Flex flexDirection="column" rowGap="8px">
        <div className="font-size-xlarge">{name}</div>
        {name === 'coworkers' && <Select value={nurseId} options={options} onItemSelect={onItemSelect} /> }
        {results && <Table columnNames={columnNames} rows={results} />}
        <div>Rows: {results?.length}</div>
        <Button onClick={goBack} variant={'secondary'}>Back</Button>
      </Flex>
    </Card>
  );
}