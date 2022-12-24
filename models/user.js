"use strict";
const { Model } = require("sequelize");
var DataTypes = require("sequelize/lib/data-types");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {}
  User.init(
    {
      name: DataTypes.STRING(100),
      family: DataTypes.STRING(100),
      username: DataTypes.STRING(100),
      email: DataTypes.STRING(100),
      imageUrl: DataTypes.STRING(100),
      secrect_token: DataTypes.STRING(16),
      registration_type: DataTypes.ENUM("email", "google"),
      password: DataTypes.STRING(80),
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
