import { useEffect, useState } from 'react';

export function usePrivateKeys() {
  const [payPrivKey, setPayPrivKey] = useState(null);
  const [payAddress, setPayAddress] = useState(null);
  const [objPrivKey, setObjPrivKey] = useState(null);
  const [objAddress, setObjAddress] = useState(null);

  useEffect(() => {
    console.log("useEffect running");
    loadKeys();
  }, []);

  function loadKeys() {
    console.log("loadKeys running");
    const payKey = localStorage.getItem('payPrivKey') || '';
    const payAddress = localStorage.getItem('payAddress') || '';
    const objKey = localStorage.getItem('objPrivKey') || '';
    const objAddress = localStorage.getItem('objAddress') || '';

    console.log("payKey from localStorage:", `'${payKey}'`);
    console.log("objKey from localStorage:", `'${objKey}'`);


    if (!payKey) {
      console.log("Generating new Pay Key")
      generateNewPayKey();
    } else {
      console.log("Setting  Pay Key", typeof(payKey))
      setPayPrivKey(payKey);
      setPayAddress(payAddress)
    }

    if (!objKey) {
      console.log("Generating new Obj Key")
      generateNewObjKey();
    } else {
      console.log("Setting  Obj Key", typeof(objKey))
      setObjPrivKey(objKey);
      setObjAddress(objAddress);
    }
  }

  function generateNewPayKey() {
    const pk = window.nimble.PrivateKey.fromRandom();
    const pkString = pk.toString();
    const address = pk.toAddress().toString();
    localStorage.setItem('payPrivKey', pkString);
    localStorage.setItem('payAddress', address);
    console.log("New pay key: ", pkString, "New pay address: ", address);
    setPayPrivKey(pkString);
    setPayAddress(address);
  }

  function generateNewObjKey() {
    const pk = window.nimble.PrivateKey.fromRandom();
    const pkString = pk.toString();
    const address = pk.toAddress().toString();
    localStorage.setItem('objPrivKey', pk);
    localStorage.setItem('objAddress', address);
    console.log("New pay key: ", pkString, "New pay address: ", address);
    setObjPrivKey(pkString);
    setObjAddress(address);
  }

  function setCustomPayKey(pk) {
    console.log("Set custom pay keys running")
    console.log("Setting Pay Key:", pk);
    localStorage.setItem('payPrivKey', pk);
    const prk = window.nimble.PrivateKey.fromString(pk);
    const address = prk.toAddress().toString();
    console.log("New pay key: ", prk, "New pay address: ", address);
    localStorage.setItem('payAddress', address);
    setPayPrivKey(pk);
    setObjAddress(address)
  }

  function setCustomObjKey(pk) {
    console.log("Set custom obj keys running")
    localStorage.setItem('objPrivKey', pk);
    const prk = window.nimble.PrivateKey.fromString(pk);
    const address = prk.toAddress().toString();
    localStorage.setItem('objAddress', address);
    console.log("New pay key: ", prk, "New pay address: ", address);
    setObjPrivKey(pk);
    setObjAddress(address)
  }

  return {
    payPrivKey,
    payAddress,
    objPrivKey,
    objAddress,
    generateNewPayKey,
    generateNewObjKey,
    setCustomPayKey,
    setCustomObjKey,
    loadKeys
  };
}