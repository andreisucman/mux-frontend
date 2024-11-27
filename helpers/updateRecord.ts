type HandleUpdateRecordType = {
  contentId: string;
  updateObject: { [key: string]: any };
  setRecords: React.Dispatch<React.SetStateAction<any>>;
};

const updateRecord = ({ contentId, updateObject, setRecords }: HandleUpdateRecordType) => {
  try {
    setRecords((prev: any) =>
      prev?.map((rec: any) => (rec._id === contentId ? { ...rec, ...updateObject } : rec))
    );
  } catch (err) {
    console.log("Error in updateRecord: ", err);
  }
};

export default updateRecord;
