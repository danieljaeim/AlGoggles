let calcDistance = (x1, x2, y1, y2) => {
    return Math.sqrt(Math.pow(y1 - y2, 2) + Math.pow(x1 - x2, 2)).toFixed(4);
}

export { calcDistance }