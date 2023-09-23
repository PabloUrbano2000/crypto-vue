import { ref, onMounted, computed } from "vue";

export default function useCripto() {
  const monedas = ref([
    { codigo: "USD", texto: "Dolar de Estados Unidos" },
    { codigo: "MXN", texto: "Peso Mexicano" },
    { codigo: "EUR", texto: "Euro" },
    { codigo: "GBP", texto: "Libra Esterlina" },
  ]);

  const criptomonedas = ref([]);
  const cotizacion = ref({});
  const cargando = ref(false);

  const URL_CRYTOCOMPARE = "https://min-api.cryptocompare.com";

  onMounted(() => {
    const url = `${URL_CRYTOCOMPARE}/data/top/mktcapfull?limit=20&tsym=USD`;
    fetch(url)
      .then((res) => res.json())
      .then(({ Data }) => (criptomonedas.value = Data))
      .catch((err) => console.log(err));
  });

  const obtenerCotizacion = async (cotizar) => {
    cargando.value = true;
    cotizacion.value = {};
    try {
      const { moneda, criptomoneda } = cotizar;
      const url = `${URL_CRYTOCOMPARE}/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;
      const respuesta = await fetch(url);
      const data = await respuesta.json();
      cotizacion.value = data.DISPLAY[criptomoneda][moneda];
    } catch (error) {
      console.log(error);
    } finally {
      cargando.value = false;
    }
  };

  const mostrarCotizacion = computed(() =>
    Object.values(cotizacion.value).length > 0 ? true : false
  );

  return {
    monedas,
    criptomonedas,
    cargando,
    cotizacion,
    obtenerCotizacion,
    mostrarCotizacion,
  };
}
