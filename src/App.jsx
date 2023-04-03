import React from "react";
import axios from "axios";

function App() {
    const [data, setData] = React.useState(null);
    const url = "http://127.0.0.1:3500";

    const GetData = () => {
        axios.get(url).then((res) => {
            setData(res.data);
        });
    };

    return (
        <div>
            <div>ここに処理を書いていきます</div>
            {data ? <div>{data.msg}</div> : <button onClick={GetData}>データを取得</button>}
        </div>
    );
}

export default App;

