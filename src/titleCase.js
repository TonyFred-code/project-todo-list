export function titleCase(sentence) {
    if (typeof sentence !== "string" || sentence.trim() === "") {
      throw new Error("Invalid input type: input must be a sentence");
    }

    let words = sentence.trim().split(/\s+/);

    for (let i = 0; i < words.length; i++) {
      words[i] =
        words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase();
    }

    let titleCasedSentence = words.join(" ");
    return titleCasedSentence;
  }
