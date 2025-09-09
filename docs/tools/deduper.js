export default class {
  update(el, event) {
    const lines = event.target.value.split("\n");
    const seen = [];
    const output = [];
    lines.forEach((line) => {
      if (line === "") {
        output.push(line);
      } else if (!seen.includes(line)) {
        seen.push(line);
        output.push(line);
      }
    });
    el.innerHTML = output.join("\n");
  }
}
