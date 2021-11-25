import Debug from "debug";
import chalk from "chalk";
import landmarkModel from "../../database/models/landMarks";

const debug = Debug("HiCity:landmark");
class NewError extends Error {
  code: number | undefined;
}

export const getLandmarks = async (req, res, next) => {
  try {
    const landmarks = await landmarkModel.find();
    res.json(landmarks);
  } catch (error) {
    next(error);
  }
};

export const getLandmarkById = async (req, res, next) => {
  const { idLandmark } = req.params;
  try {
    const searchedLandmark = await landmarkModel.findById(idLandmark);
    if (searchedLandmark) {
      res.json(searchedLandmark);
    } else {
      const error = new NewError("Landmark not found");
      error.code = 404;
      next(error);
    }
  } catch (error) {
    error.code = 400;
    next(error);
  }
};

export const createLandmark = async (req, res, next) => {
  const image = req.file ? req.file : { fileURL: "" };

  const {
    title,
    city,
    category,
    coordinates,
    lastUpdate,
    introduction,
    description,
  } = req.body;

  try {
    const { latitude, longitude } = coordinates;
    const landmark = await landmarkModel.findOne({
      coordinates: {
        latitude,
        longitude,
      },
    });

    if (landmark) {
      const error: any = new NewError("This landmark already exists");
      debug(chalk.red(error.message));
      error.code = 400;
      next(error);
    } else {
      const newLandmark = await landmarkModel.create({
        title,
        city,
        imageUrl: image.fileURL,
        category,
        coordinates,
        lastUpdate,
        introduction,
        description,
      });
      res.status(201);
      res.json(newLandmark);
      debug(chalk.green("Landmark created correctly"));
    }
  } catch (error) {
    error.code = 400;
    error.message = "Ouch! This is not a landmark!";
    debug(chalk.red(error.message));
    next(error);
  }
};
