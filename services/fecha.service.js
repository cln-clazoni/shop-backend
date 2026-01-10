function fechaDeHoyStr() {
  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  const fechaDeHoy = new Date();
  const fecha = `${fechaDeHoy.getDate()} de ${
    meses[fechaDeHoy.getMonth()]
  } de ${fechaDeHoy.getFullYear()}`;
  return fecha;
}
function fechaDeHoyStrGuion() {
  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  const fechaDeHoy = new Date();
  const fecha = `${fechaDeHoy.getDate()}-${
    meses[fechaDeHoy.getMonth()]
  }-${fechaDeHoy.getFullYear()}`;
  return fecha;
}
module.exports = {
  fechaDeHoyStr,
  fechaDeHoyStrGuion
};
