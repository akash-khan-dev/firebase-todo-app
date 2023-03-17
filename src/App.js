import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import {
  getDatabase,
  ref,
  set,
  push,
  onValue,
  remove,
  update,
} from "firebase/database";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

function App() {
  let [info, setInfo] = useState({ fullName: "", email: "", designation: "" });
  const handleChange = (e) => {
    let { name, value } = e.target;
    setInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  let [error, setError] = useState("");

  const validationForm = () => {
    if (!info.fullName || !info.email || !info.designation) {
      return setError("please full the form");
    }
  };
  // data write
  const db = getDatabase();
  const handleSubmit = () => {
    validationForm();
    if (info.fullName && info.email && info.designation) {
      set(push(ref(db, "users/")), {
        fullName: info.fullName,
        email: info.email,
        designation: info.designation,
      });
      setError("");
    }
  };

  // data write

  let [data, setData] = useState([]);
  useEffect(() => {
    const starCountRef = ref(db, "users/");

    onValue(starCountRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((x) => {
        arr.push({ ...x.val(), id: x.key });
      });
      setData(arr);
    });
  }, []);
  // data delete
  const handleDelete = (id) => {
    remove(ref(db, "users/" + id));
  };
  // data edit
  let [show, setShow] = useState(false);
  const handleEdit = (value) => {
    setInfo({
      fullName: value.fullName,
      email: value.email,
      designation: value.designation,
    });
    setShow(true);
    setIds(value.id);
  };
  // data update
  let [ids, setIds] = useState("");
  const handleUpdate = () => {
    update(ref(db, "users/" + ids), {
      fullName: info.fullName,
      email: info.email,
      designation: info.designation,
    });
    setShow(false);
    setInfo({ fullName: "", email: "", designation: "" });
  };

  return (
    <div>
      <Container fixed>
        <div className="form">
          <TextField
            onChange={handleChange}
            name="fullName"
            fullWidth
            // id="standard-basic"
            label="Inter Your Full Name"
            variant="standard"
            value={info.fullName}
          />
          <TextField
            onChange={handleChange}
            name="email"
            fullWidth
            // id="standard-basic"
            label="Inter Your Email"
            variant="standard"
            margin="normal"
            value={info.email}
          />
          <TextField
            onChange={handleChange}
            name="designation"
            fullWidth
            // id="standard-basic"
            label="Inter Your Designation"
            variant="standard"
            margin="normal"
            value={info.designation}
          />

          {show ? (
            <Button
              onClick={handleUpdate}
              variant="contained"
              className="Sbtn"
              fullWidth
            >
              update
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              variant="contained"
              className="Sbtn"
              fullWidth
            >
              submit
            </Button>
          )}

          <p className="error">{error && error}</p>
        </div>
        <div className="card">
          {data.map((item, i) => (
            <Card key={i} className="box">
              <CardContent>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  {item.fullName},
                  <br />
                  {item.email},
                  <br />
                  {item.designation}
                </Typography>
              </CardContent>
              <Button
                onClick={() => handleDelete(item.id)}
                variant="contained"
                className="Dbtn"
              >
                delete
              </Button>
              <Button
                onClick={() => handleEdit(item)}
                variant="contained"
                className="Ebtn"
              >
                edit
              </Button>
            </Card>
          ))}
        </div>
      </Container>
    </div>
  );
}

export default App;
