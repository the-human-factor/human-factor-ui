export function calcMainDims(
  sourceDims,
  windowSize,
  { extraHeight = 0, extraWidth = 0 } = {}
) {
  const fracWidthScaled = windowSize.width / (sourceDims.width + extraWidth);
  const fracHeightScaled =
    windowSize.height / (sourceDims.height + extraHeight);

  if (fracHeightScaled > 1.0 && fracWidthScaled > 1.0) {
    return {
      width: sourceDims.width,
      height: sourceDims.height,
      scale: 1.0,
    };
  } else if (fracWidthScaled < fracHeightScaled) {
    // Width is limiting
    return {
      width: windowSize.width - extraWidth,
      height: sourceDims.height * fracWidthScaled,
      scale: fracWidthScaled,
    };
  } else {
    // Height is limiting
    return {
      width: sourceDims.width * fracHeightScaled,
      height: windowSize.height - extraHeight,
      scale: fracHeightScaled,
    };
  }
}

export function calcDims(
  sourceDims,
  windowSize,
  miniScale,
  { extraHeight = 0, extraWidth = 0 } = {}
) {
  const dims = calcMainDims(sourceDims, windowSize, {
    extraHeight,
    extraWidth,
  });
  return {
    miniWidth: Math.round(dims.width * miniScale),
    miniHeight: Math.round(dims.height * miniScale),
    ...dims,
  };
}
