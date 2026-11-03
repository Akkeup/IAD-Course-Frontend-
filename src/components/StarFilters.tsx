import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import type { Filters } from '../types';

interface Props {
  value: Filters;
  onChange: (value: Filters) => void;
  onReset: () => void;
}

// Ползунок редактирует черновое значение; «Найти» передаёт фильтр родителю.
export function StarFilters({ value, onChange, onReset }: Props) {
  const [distance, setDistance] = useState(value.maxDistance || '35');

  return <>
    <Form className="filter-form" onSubmit={(event) => {
      event.preventDefault();
      onChange({ maxDistance: distance });
    }}>
      <Form.Label htmlFor="distance-kpc" className="visually-hidden">Максимальное расстояние от центра в килопарсеках</Form.Label>
      <span className="search-icon" aria-hidden="true">R</span>
      <Form.Range id="distance-kpc" min="0" max="35" step="0.1" value={distance}
        aria-valuetext={`${Number(distance).toFixed(1)} кпк`}
        onChange={(event) => setDistance(event.target.value)} />
      <output htmlFor="distance-kpc">{Number(distance).toFixed(1)} кпк</output>
      <Button type="submit" variant="primary">Найти</Button>
    </Form>
    {value.maxDistance !== '' && <div className="filter-state">
      <span>R ≤ {Number(value.maxDistance).toFixed(1)} кпк</span>
      <Button variant="link" onClick={() => { setDistance('35'); onReset(); }}>Сбросить</Button>
    </div>}
  </>;
}
