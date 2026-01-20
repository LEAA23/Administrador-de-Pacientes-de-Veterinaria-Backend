const generearId = () => {
    return Date.now().toString() + Math.random().toString(32).substring(2);
}

export default generearId;