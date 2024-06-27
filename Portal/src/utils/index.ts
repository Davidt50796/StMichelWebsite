/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from "moment";

export function scrollToTop() {
  document.getElementById('main')?.scrollTo({ top: 0, behavior: 'smooth' })
}

export function downloadMerchantsBlobAsXlsx(blobData: Blob) {
  const url = URL.createObjectURL(blobData)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', 'merchants.xlsx')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  // Revoke the Object URL when it's no longer needed
  URL.revokeObjectURL(url)
}

export function downloadBlobAsCsv(blobData: Blob, name: string) {
  const url = URL.createObjectURL(blobData)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', name)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function formatTheDate(date: string | Date, format?: string){
  const formatDate = format ? format : "DD/MM/YYYY HH:mm:ss";
  return moment(date).format(formatDate);
}

export const capitalize = (str: string) => {
  return str.toUpperCase()
}

export const convertToTitleCase = (input: string): string => {
  const words = input.toLowerCase().split('_')
  const capitalizedWords = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  return capitalizedWords.join(' ')
}

const now = Date.now();
export const downloadCSV = (csvContent:string, fileName?:string) => {
 
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `${fileName ? fileName : "file"}_${now}.csv`);
  document.body.appendChild(link);
  link.click();
};


export const statusColorMap = {
  1: "green",
  0: "red",
};

export const statusLabelMap = {
  1: "Active",
  0: "disabled",
};

export const formatAmount = (value: number | string | null) => {
  if (value && value !== 0 && value !== "-") {
    if (value as number < 0) {
      return (
        "-" +
        Number(
          value
            .toString()
            .replace(/[^0-9,]/g, "")
            .replace(/,+/g, "")
        ).toLocaleString()
      );
    } else {
      return Number(
        value
          .toString()
          .replace(/[^0-9,]/g, "")
          .replace(/,+/g, "")
      ).toLocaleString();
    }
  } else return 0;
};

export function getCurrenySimilarity(array1: any, array2: any) {
  return array1.filter(function (o1:any) {
    return array2.some(function (o2: any) {
      return o1.currency === o2.currency;
    });
  });
}

export const removeComma = (str: string) => {
  return str.replace(/,/g, '')
}

export function convertDateToTimeStamp(date: string | Date, format: string) {
  const formatDate = format ? format : "YYYY-MM-DD";
  return moment(date, formatDate).unix();
}





