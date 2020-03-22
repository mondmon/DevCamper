const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const geocoder = require("../utils/geocoder");

//@Desc Get All Bootcamps
//@route  GET /api/v1/bootcamps
//@access Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query;
  let queryStr = JSON.stringify(re.query);
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
  query = Bootcamp.find(JSON.parse(queryStr));
  const bootcamps = await query;
  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps });
});

// GET GET GET GET GET GET GET GET GET GET GET GET GET GET GET GET GET GET

//@Desc Get Single Bootcamp
//@route  GET /api/v1/bootcamps/:id
//@access Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp not found with an id of ${res.params.id}`,
        404
      )
    );
  }
  res.status(200).json({ success: true, data: bootcamp });
});

// @desc      Get bootcamps within a radius
// @route     GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access    Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calc radius using radians
  // Divide dist by radius of Earth
  // Earth Radius = 3,963 mi / 6,378 km
  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps
  });
});

// POST POST POST POST POST POST POST POST POST POST POST POST POST POST POST POST POST POST

//@Desc Create new Bootcamp
//@route  POST /api/v1/bootcamps
//@access Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({ success: true, data: bootcamp });
});

//@Desc Update new Bootcamp
//@route  PUT /api/v1/bootcamps/:id
//@access Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    //To get the new data in the response
    new: true,
    runValidator: true
  });
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp not found with an id of ${res.params.id}`,
        404
      )
    );
  }
  res.status(200).json({ success: true, data: bootcamp });
});

//@Desc Delete Bootcamp
//@route  DELETE /api/v1/bootcamps/:id
//@access Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp not found with an id of ${res.params.id}`,
        404
      )
    );
  }
  res.status(200).json({ success: true, data: {} });
});
