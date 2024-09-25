import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

function Info() {
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user);

  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState("");
  const [ifEdit, setIfEdit] = useState(false);
  const [editValues, setEditValues] = useState(null); // state to hold the edited values

  useEffect(() => {
    const fetchData = async () => {
      if (userInfo) return;
      console.log(user.id);

      try {
        const response = await fetch("http://localhost:5000/info", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: user.id }),
        });
        const data = await response.json();
        console.log(data.address);
        if (response.ok) {
          setUserInfo(data);
          setEditValues(data); // set the initial values
        } else {
          setError(data.error || "Failed to fetch user info");
        }
      } catch (err) {
        setError("Server error");
      }
    };

    fetchData();
  }, [user.id, userInfo]);

  const handleInputChange = (key, value) => {
    setEditValues((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        [key]: value,
      },
    }));
  };
  
  const handleInputAddressChange = (key, value) => {
    setEditValues((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [key]: value,
      },
    }));
  };
  

  const saveEdit = async () => {
    console.log(editValues);
    const confirmation = window.confirm(
      "Are you sure you want to save the changes? You cannot undo this action."
    );
    if (!confirmation) {
      return;
    }
    setIfEdit(!ifEdit);
    try {
      const response = await fetch("http://localhost:5000/info/edit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id, userInfo: editValues }),
      });
      const data = await response.json();
      console.log(data);
      
      if (response.ok) {
        setUserInfo(editValues);
      } else {
        setError(data.error || "Failed to save user info");
      }
    } catch (err) {
      setError("Server error");
    }
  };

  if (error) return <p>{error}</p>;
  if (!userInfo) return <p>Loading...</p>;

  return (
    <div className="information">
      <button>
        <FontAwesomeIcon icon={faEdit} onClick={() => setIfEdit(!ifEdit)} />
      </button>
      {Object.entries(userInfo.user).map(([key, value], index) => (
        <div key={index}>
          {key !== "password" && (
            <>
              {ifEdit && key !== "id" ? (
                <input
                  type="text"
                  defaultValue={value}
                  placeholder={key}
                  onChange={(e) => handleInputChange(key, e.target.value)}
                />
              ) : (
                <p>
                  <strong>{key}:</strong> {value}
                </p>
              )}
            </>
          )}
        </div>
      ))}
      {Object.entries(userInfo.address).map(([key, value], index) => (
        <div key={index}>
          {key !== "userId" && key !== "id" && (
            <>
              {ifEdit && key !== "id" ? (
                <input
                  type="text"
                  defaultValue={value}
                  placeholder={key}
                  onChange={(e) => handleInputAddressChange(key, e.target.value)}
                />
              ) : (
                <p>
                  <strong>{key}:</strong> {value}
                </p>
              )}
            </>
          )}
        </div>
      ))}

      {ifEdit && (
        <>
          <button onClick={saveEdit}>Save</button>
          <button onClick={() => setIfEdit(!ifEdit)}>Cancel</button>
        </>
      )}
    </div>
  );
}

export default Info;
