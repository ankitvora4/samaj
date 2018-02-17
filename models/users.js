module.exports = function (sequelize, DataTypes) {
  var users = sequelize.define("users", {
    "first_name": { type: DataTypes.STRING(20), allowNull: false, validate: {notEmpty: true}},
    "middle_name" : { type: DataTypes.STRING(20), allowNull: false, validate: {notEmpty: true}},
    "last_name" : { type: DataTypes.STRING(20), allowNull: false, validate: {notEmpty: true}},
    "mobile_number" : { type: DataTypes.STRING(20), allowNull: false, validate: {notEmpty: true}},
    "email_id" : { type: DataTypes.STRING(20), allowNull: false, validate: {notEmpty: true}}
  }, {
    classMethods: {
      associate: function (models) {

      }
    },
    underscored: true
  });

  return users;
};
