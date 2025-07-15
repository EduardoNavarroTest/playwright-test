export const deleteItem = (data, index) => {
    const updated = { ...data };
    updated.criteria = [...updated.criteria]; // aseguramos inmutabilidad
    updated.criteria.splice(index, 1);
    return updated;
  };
  
  export const deleteSubtask = (data, parentIndex, subIndex) => {
    const updated = { ...data };
    updated.criteria = [...updated.criteria];
    const subtasks = [...updated.criteria[parentIndex].subtasks];
    subtasks.splice(subIndex, 1);
    updated.criteria[parentIndex] = {
      ...updated.criteria[parentIndex],
      subtasks,
    };
    return updated;
  };
  
  export const addSubtask = (data, index) => {
    const updated = { ...data };
    updated.criteria = [...updated.criteria];
    const subtasks = [...updated.criteria[index].subtasks, { description: 'Nueva subtarea' }];
    updated.criteria[index] = {
      ...updated.criteria[index],
      subtasks,
    };
    return updated;
  };
  