import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, username, password } = req.body;
    console.log("email -->", email);

    if (
        [fullName, email, username, password].some(
            (field) => field?.trim() === ""
        )
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = User.findOne({
        $or: [{ username }, { email }],
    });

    if (existedUser) {
        throw new ApiError(
            409,
            "User with this email or username already exists"
        );
    }

    console.log(req.files?.avatar[0]?.path);
    console.log(req.files?.coverImage[0]?.path);

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar image is required");
    }
    if (!coverImageLocalPath) {
        throw new ApiError(400, "Cover image is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatar) {
        throw new ApiError(400, "Avatar image is required");
    }

    const newUser = await User.create({
        fullName,
        avatar: avatar?.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase(),
    });

    const createdUser = await User.findById(newUser._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new ApiError(500, "User registration failed !!!");
    }

    return res
        .status(201)
        .json(
            new ApiResponse(200, createdUser, "User registered successfully")
        );
});

export { registerUser };
