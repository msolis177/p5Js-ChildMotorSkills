function completeGame(gameName) {
    localStorage.setItem(
        `tinyTots.${gameName}Complete`,
        "true"
    );
}