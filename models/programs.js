module.exports = function (sequelize, DataTypes) {
  var programs = sequelize.define("programs", {
    "subject": { type: DataTypes.STRING(20), allowNull: false, validate: {notEmpty: true}},
    "message" : { type: DataTypes.STRING(20), allowNull: false, validate: {notEmpty: true}}
  }, {
    classMethods: {
      associate: function (models) {

      }
    },
    underscored: true
  });

  return programs;
};
