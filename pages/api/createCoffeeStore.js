import {
  table,
  getMinifiedRecords,
  findRecordByFilter,
} from "../../lib/airtable";

const createCoffeeStore = async (req, res) => {
  if (req.method === "POST") {
    const { id, name, neighborhood, address, imgUrl, voting } = req.body;
    try {
      if (id) {
        const records = await findRecordByFilter(id);
        if (records.length !== 0) {
          res.json(records);
        } else {
          if (name) {
            const createRecords = await table.create([
              {
                fields: {
                  id,
                  name,
                  address,
                  neighborhood,
                  voting,
                  imgUrl,
                },
              },
            ]);
            const records = getMinifiedRecords(createRecords);
            res.json(records);
          } else {
            res.status(400).json({ message: "Name is missing" });
          }
        }
      } else {
        res.status(400).json({ message: "Id is missing" });
      }
    } catch (err) {
      console.error("Error creating or finding a store", err);
      res
        .status(500)
        .json({ message: "Error creating or finding a store", err });
    }
  }
};

export default createCoffeeStore;
