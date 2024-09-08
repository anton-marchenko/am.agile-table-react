import "./App.css";

const CommonTable = () => {
  return (
    <table className="table">
      <tr>
        <th className="action-col">Action</th>
        <th>
          <span _ngcontent-gdu-c27="" className="sort">
            {" "}
            Rating
          </span>
        </th>
        <th style={{ width: "100" }}>
          <span className="sort">
            {" "}
            Author <span className="dir-icon">[desc]</span>
          </span>
        </th>
        <th>
          <span _ngcontent-gdu-c27="" className="sort">
            <span style={{ color: "green" }}> Name </span>
          </span>
        </th>
        <th>
          <span _ngcontent-gdu-c27="">
            <span> Descr </span>
          </span>
        </th>
        <th>
          <span _ngcontent-gdu-c27="">
            <span> Date </span>
          </span>
        </th>
        <th>
          <span _ngcontent-gdu-c27="" className="sort">
            <span> Tags </span>
            <span _ngcontent-gdu-c27="" className="dir-icon">
              [desc]
            </span>
          </span>
        </th>
        <th>
          <span _ngcontent-gdu-c27="">
            <span> New Column </span>
          </span>
        </th>
      </tr>
      <tr>
        <td className="action-col">
          <button>Edit</button>
        </td>
        <td> 4 </td>
        <td> Ant </td>
        <td>
          <span style={{ color: "green" }}> joe </span>
        </td>
        <td> pass </td>
        <td> Oct 16, 2021 </td>
        <td>
          <div> tag1 </div>
          <div> tag2 </div>
        </td>
        <td> --- </td>
      </tr>
      <tr>
        <td className="action-col">
          <button>Edit</button>
        </td>
        <td> 5 </td>
        <td> Lex </td>
        <td>
          <span style={{ color: "green" }}> joe2 </span>
        </td>
        <td> pass3 </td>
        <td> Oct 10, 2021 </td>
        <td>
          <div> tag1 </div>
        </td>
        <td> --- </td>
      </tr>
      <tr>
        <td className="action-col">
          <button>Edit</button>
        </td>
        <td> --- </td>
        <td> --- </td>
        <td>
          <span style={{ color: "green" }}> --- </span>
        </td>
        <td> --- </td>
        <td> --- </td>
        <td>---</td>
        <td> --- </td>
      </tr>
    </table>
  );
};

const RowEditForm = () => {
  return <div>xxx</div>;
};

const CreateButton = () => {
  return (
    <div className="create-btn-box">
      <button disabled={true} onClick={() => {}}>
        Create row
      </button>
    </div>
  );
};

const AttributeConfigurator = () => {
  return <div>xxx</div>;
};

function App() {
  return (
    <div className="app">
      <div className="left-side">
        <CommonTable></CommonTable>

        <CreateButton></CreateButton>

        <RowEditForm></RowEditForm>
      </div>

      <div className="right-side">
        <AttributeConfigurator></AttributeConfigurator>
      </div>
    </div>
  );
}

export default App;
