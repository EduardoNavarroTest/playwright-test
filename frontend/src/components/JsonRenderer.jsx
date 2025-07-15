import React from 'react';
import ParsedCriteria from '../components/ParsedCriteria.jsx';
import ParsedCases from '../components/ParsedCases.jsx';

const JsonRenderer = ({
  option,
  jsonData,
  onEdit,
  onDelete,
  onAdd,
  onUpdate,
  onDeleteSubtask
}) => {
  if (!jsonData) return null;

  return (
    <>
      {option === 'criterios' ? (
        <ParsedCriteria
          data={jsonData}
          onEdit={onEdit}
          onDelete={onDelete}
          onAdd={onAdd}
          onUpdate={onUpdate}
          onDeleteSubtask={onDeleteSubtask}
        />
      ) : (
        <ParsedCases
          data={jsonData}
          onUpdate={onUpdate}
          onDeleteCase={onDelete}
        />
      )}
    </>
  );
};

export default JsonRenderer;
