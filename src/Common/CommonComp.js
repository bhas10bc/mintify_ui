import CryptoJS from "crypto-js";

export const encrypt = (data, keyword) => {
  const encryptedLoginData = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    keyword
  );
  return encryptedLoginData.toString();
};

export const decrypt = (item, keyword) => {
  try {
    const decryptedData = CryptoJS.AES.decrypt(item, keyword).toString(
      CryptoJS.enc.Utf8
    );
    const decryptedDataJson = JSON.parse(decryptedData);
    return decryptedDataJson;
  } catch (error) {
    return null;
  }
};
