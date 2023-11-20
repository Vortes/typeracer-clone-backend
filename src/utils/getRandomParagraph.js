const words = require("../commonWords.json");

const getRandomParagraph = (numberOfWords) => {
    return words
        .sort(() => Math.random() - Math.random())
        .slice(0, numberOfWords);
};

module.exports = getRandomParagraph;
