module.exports = function(sequelize, DataTypes) {
  return sequelize.define('otps', {
    id: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    otp: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    },
    mobile_number: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    is_verified: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    user_secret: {
      type: DataTypes.STRING(36),
      allowNull: true
    }
  }, {
    classMethods: {
      associate: function (models) {
      }
    },
    underscored: true
  });
};
