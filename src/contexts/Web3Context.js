import React, {
  createContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import "react-native-get-random-values";

export const Web3Context = createContext();

export const Web3ContextProvider = ({ children }) => {
  const Web3 = require("web3");

  const web3 = useMemo(() => {
    return new Web3("https://public-en-baobab.klaytn.net");
  }, []);

  const contract = useMemo(() => {
    return new web3.eth.Contract(
      abi,
      "0xb7a7ea95d27E1f5Deb120a681d6F7730Cb9C0263"
    );
  }, []);

  const [places, setPlaces] = useState([]);
  const [count, setCount] = useState(0);

  // timer
  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevCount) => prevCount + 1);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const addPlace = useCallback(
    async (
      name,
      englishName,
      buildingNum,
      latitude,
      longitude,
      tags,
      description
    ) => {
      try {
        const tx = contract.methods.addPlace(
          name,
          englishName,
          buildingNum,
          web3.utils.toWei(latitude, "micro"),
          web3.utils.toWei(longitude, "micro"),
          tags,
          description
        );
        const createTransaction = await web3.eth.accounts.signTransaction(
          {
            from: "0xac96b49103f579b1862fc44b688a35ceb0dc58a2",
            to: "0xb7a7ea95d27E1f5Deb120a681d6F7730Cb9C0263",
            data: tx.encodeABI(),
            gas: await tx.estimateGas(),
            maxFeePerGas: 250000000000,
            maxPriorityFeePerGas: 250000000000,
          },
          "0xdbc98d53eb2ff695194ec841d8fc4cd63e42abc98d901f94237780548aeaf453"
        );
        await web3.eth.sendSignedTransaction(createTransaction.rawTransaction);
      } catch (error) {
        console.log(error);
      }
      console.log("addPlace completed");
      setCount((prevCount) => prevCount + 1);
    },
    []
  );

  const deletePlace = useCallback(async (id) => {
    try {
      const tx = contract.methods.deletePlace(id);
      const createTransaction = await web3.eth.accounts.signTransaction(
        {
          from: "0xac96b49103f579b1862fc44b688a35ceb0dc58a2",
          to: "0xb7a7ea95d27E1f5Deb120a681d6F7730Cb9C0263",
          data: tx.encodeABI(),
          gas: await tx.estimateGas(),
          maxFeePerGas: 250000000000,
          maxPriorityFeePerGas: 250000000000,
        },
        "0xdbc98d53eb2ff695194ec841d8fc4cd63e42abc98d901f94237780548aeaf453"
      );
      await web3.eth.sendSignedTransaction(createTransaction.rawTransaction);
    } catch (error) {
      console.log(error);
    }
    console.log("deletePlace completed");
    setCount((prevCount) => prevCount + 1);
  }, []);

  const updatePlace = useCallback(
    async (
      id,
      name,
      englishName,
      buildingNum,
      latitude,
      longitude,
      tags,
      description
    ) => {
      try {
        const tx = contract.methods.updatePlace(
          id,
          name,
          englishName,
          buildingNum,
          web3.utils.toWei(latitude, "micro"),
          web3.utils.toWei(longitude, "micro"),
          tags,
          description
        );
        const createTransaction = await web3.eth.accounts.signTransaction(
          {
            from: "0xac96b49103f579b1862fc44b688a35ceb0dc58a2",
            to: "0xb7a7ea95d27E1f5Deb120a681d6F7730Cb9C0263",
            data: tx.encodeABI(),
            gas: await tx.estimateGas(),
            maxFeePerGas: 250000000000,
            maxPriorityFeePerGas: 250000000000,
          },
          "0xdbc98d53eb2ff695194ec841d8fc4cd63e42abc98d901f94237780548aeaf453"
        );
        await web3.eth.sendSignedTransaction(createTransaction.rawTransaction);
      } catch (error) {
        console.log(error);
      }
      console.log("updatePlace completed");
      setCount((prevCount) => prevCount + 1);
    },
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      const result = await contract.methods.getAllPlaces().call();
      const newPlaces = [];

      for (let i = 0; i < result[0].length; i++) {
        newPlaces.push({
          id: Number(result[0][i]),
          name: result[1][i],
          englishName: result[2][i],
          buildingNum: result[3][i],
          latitude: Number(web3.utils.fromWei(result[4][i], "micro")),
          longitude: Number(web3.utils.fromWei(result[5][i], "micro")),
          tags: result[6][i],
          description: result[7][i],
        });
      }
      setPlaces(newPlaces);
    };
    fetchData();
  }, [count]);

  return (
    <Web3Context.Provider
      value={{ places, addPlace, deletePlace, updatePlace }}
    >
      {children}
    </Web3Context.Provider>
  );
};

const abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "string",
        name: "_englishName",
        type: "string",
      },
      {
        internalType: "string",
        name: "_buildingNum",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_latitude",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_longitude",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_tags",
        type: "string",
      },
      {
        internalType: "string",
        name: "_description",
        type: "string",
      },
    ],
    name: "addPlace",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256",
      },
    ],
    name: "deletePlace",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllPlaces",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
      {
        internalType: "string[]",
        name: "",
        type: "string[]",
      },
      {
        internalType: "string[]",
        name: "",
        type: "string[]",
      },
      {
        internalType: "string[]",
        name: "",
        type: "string[]",
      },
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
      {
        internalType: "string[]",
        name: "",
        type: "string[]",
      },
      {
        internalType: "string[]",
        name: "",
        type: "string[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "places",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "englishName",
        type: "string",
      },
      {
        internalType: "string",
        name: "buildingNum",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "latitude",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "longitude",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "tags",
        type: "string",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "placesCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "string",
        name: "_englishName",
        type: "string",
      },
      {
        internalType: "string",
        name: "_buildingNum",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_latitude",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_longitude",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_tags",
        type: "string",
      },
      {
        internalType: "string",
        name: "_description",
        type: "string",
      },
    ],
    name: "updatePlace",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
