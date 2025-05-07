function TodosViewForm({ sortDirection, setSortDirection, sortField, setSortField, queryString, setQueryString }) {

  function preventRefresh(event) {
    event.preventDefault();
  }

  return (
    <>
      <form onSubmit={preventRefresh}>
        <div>
          <label>Search todos: &nbsp;</label>
          <input type="text" value={queryString} onChange={(e)=> setQueryString(e.target.value)}></input>
          <button type="button" onClick={() => setQueryString('')}>Clear</button>
        </div>
        <div>
          <label>Sort by &nbsp;</label>
          <select value={sortField} onChange={(e) => setSortField(e.target.value)}>
            <option value="createdTime">Time added</option>
            <option value="title">Title</option>
          </select>
          <label>Direction &nbsp;</label>
          <select value={sortDirection} onChange={(e) => setSortDirection(e.target.value)}>
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </form>
    </>
  )
}

export default TodosViewForm