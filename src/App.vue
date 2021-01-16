<template>
  <form @submit.prevent="search">
    <label>Search items</label>
    <div>
      <div v-for="item of searchQueries" :key="item.id">
        <input type="text" v-model="item.query" />
        <button @click.prevent="addNewQueryInput">+</button>
      </div>
    </div>
    <button @click.prevent="search">search</button>
    <button @click.prevent="clearText">clear</button>
  </form>
  <div v-if="resultsNumber > 0">Search results count: {{ resultsNumber }}</div>

  <div>
    results per page:
    <select
      id="results-per-page"
      v-model="resultsPerPage"
      @change="onResultsPerPageChange"
    >
      <option v-for="(item, index) in pageResultOptions" :key="index">{{
        item
      }}</option>
    </select>
  </div>

  <div>
    <div v-for="(results, query) in items" :key="query">
      <p>{{ query }}</p>
      <ul>
        <li
          v-for="(item, index) in results"
          :key="`${item.Food_Code}-${item.Display_Name}-${index}`"
        >
          {{ item.Display_Name }} : {{ item.Portion_Display_Name }} of
          {{ item.Portion_Amount }}, {{ item.Calories }} calories
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import FoodDisplayTable from "./dummy_data/food_display_table.json";
import wildcard from "wildcard";
var testdata = ["a.b.c", "a.b", "a", "a.b.d"];

console.log("test", wildcard("a.b.*", testdata));

/*

- Convert searchString to an array and rename it to searchQueries
- Use v-for directive to loop through searchQueries array to generate input fields
- Add down icon to add a new input field. It should just add an empty string to the searchQueries array
- Use v-model to bind each input with the searchQueries array like so: v-model="searchQueries[index]"
- Update the search to loop through searchQueries while comparing items

*/

const getRandomId = () => Math.floor(Math.random() * 100);

const createQueryObject = () => {
  return {
    id: getRandomId(),
    query: "",
  };
};

/*

Don't do this, as all queries would use the same object

let obj = {
  id: getRandomId(),
  query: "",
};
const createQueryObject = () => obj;
*/
export default {
  name: "App",
  data() {
    return {
      resultsPerPage: 10,
      searchQueries: [createQueryObject()],
      resultsNumber: 0,
      items: [],
    };
  },
  methods: {
    addNewQueryInput() {
      this.searchQueries.push(createQueryObject());
    },
    onResultsPerPageChange(e) {
      console.log("on results change", e);
      this.search();
    },
    async search() {
      console.log({ searchQueries: this.searchQueries });
      /*
        [
          {
            id: 123,
            query: 'Ice cream'
          },
          {
            id: 321,
            query: ''
          },
          {
            id: 234,
            query: 'Steak'
          }
        ]


        ['Ice cream', '', 'Steak]

        ['Ice cream', 'Steak']
      */
      const queryStrings = this.searchQueries
        .map((s) => s.query.toLowerCase())
        .filter((query) => query.length > 0);
      if (!queryStrings.length) {
        alert("Please enter search query.");
        return;
      }
      // const query = this.searchString.toLowerCase();

      /*
        {
          "ice cream": [],     
          "steak": []   
        }

      */

      const aggregatedResults = queryStrings.reduce((acc, query) => {
        acc[query] = [];
        return acc;
      }, {});
      let resultsCount = 0;
      let results = this.ingredients.reduce((acc, item) => {
        const { Display_Name } = item;
        const itemString = Display_Name.toLowerCase();
        for (const query of queryStrings) {
          const match =
            itemString.includes(query) ||
            (query.includes("*") && wildcard(query, [itemString])?.[0]);

          if (match) {
            resultsCount++;
            acc[query].push(item);
            break;
          }
        }

        return acc;
      }, aggregatedResults);

      console.log("Aggregated results", aggregatedResults);

      /* if (!Object.keys(results).length) {
        this.items = [];
        alert("no matching results");
        return;
      } */
      // if (results.length > 25) {
      // }
      this.resultsNumber = resultsCount;
      // this.items = results.slice(0, parseInt(this.resultsPerPage));
      this.items = Object.entries(results).reduce((acc, [query, results]) => {
        acc[query] = results.slice(0, parseInt(this.resultsPerPage));
        return acc;
      }, {});
      console.log("Results", this.items, results);
    },
    clearText() {
      this.searchQueries = [createQueryObject()];
      this.items = [];
    },
  },
  created() {
    this.ingredients = FoodDisplayTable.Food_Display_Table.Food_Display_Row;
    console.log(this.ingredients);

    this.pageResultOptions = [10, 25, 50, 75, 100];
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
