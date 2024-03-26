document.getElementById("treatment").addEventListener("change", function () {
  const duration =
    this.options[this.selectedIndex].getAttribute("data-duration");
  const startDate = document.getElementById("startDate").value;
  const endDate = new Date(startDate);
  endDate.setDate(new Date(startDate).getDate() + parseInt(duration));
  document.getElementById("endDate").value = endDate
    .toISOString()
    .split("T")[0];
});
