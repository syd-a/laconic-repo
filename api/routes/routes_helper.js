const retErrorMessages = (res, errArray) => {
  return res.status(400).json({errorMessages: errArray});
}

const calcLimitAndSkip = (limitIn, skipIn) => {
  let limitVal = 25;
  let skipVal = 0;

  if(!isNaN(limitIn)) {
    limitVal = Number(limitIn);
  }
  if(!isNaN(skipIn)) {
    skipVal = Number(skipIn);
  }

  return {limitVal, skipVal};
}

module.exports = {retErrorMessages, calcLimitAndSkip};
