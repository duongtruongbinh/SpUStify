import { Button } from "@material-tailwind/react";
import { bgPlaylist, LiuGrace } from "../assets";
import { useState } from "react";
const DataInput = (props) => {
  return (
    <div className="w-[50%]">
      <div className="text-[#FAF6F6]">{props.title}</div>
      <input
        type="text"
        id="playlistname"
        placeholder={props.value}
        className="bg-white h-10 w-full rounded text-black focus:outline-none pl-1"
        onChange={props.onChange}
      />
    </div>
  );
};

const Profile = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [phoneNumber, setPhoneNumber] = useState();

  const handleSubmit = () => {
    console.log("Submit");
  };

  const handleCancel = () => {
    console.log("Cancel");
  };

  return (
    <div className=" flex flex-col">
      <div className="w-full flex flex-col">
        <div className="w-full relative">
          <div
            className="h-32 bg-cover bg-center"
            style={{ backgroundImage: `url(${bgPlaylist})` }}></div>
          <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent"></div>
        </div>

        <div className="flex flex-col justify-center items-center space-y-3 w-full">
          <DataInput
            title="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}></DataInput>
          <DataInput
            title="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}></DataInput>
          <DataInput
            title="Phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}></DataInput>
          <div className="space-x-2">
            <Button
              onClick={handleCancel}
              className="h-8 bg-gray-700 hover:bg-gray-400">
              Cancle
            </Button>
            <Button onClick={handleSubmit} className="h-8 hover:bg-blue-400">
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
