/* Custom Decap CMS widget: search catalog.beer, pick a result, and it
   fills Name/Brewery/Style/ABV/IBU/Description below — all still
   manually editable in case a beer isn't in their database. Calls our
   own Netlify Function (netlify/functions/beer-search.js) rather than
   catalog.beer directly, since the API key must stay server-side.

   Registered against the "beers" collection's "beerInfo" field in
   admin/config.yml. Must load after decap-cms.js (needs the global
   `createClass` / `h` helpers it exposes) and before CMS finishes
   bootstrapping — a plain <script> tag placed right after it does that. */

(function () {
  var FIELD_KEYS = ["name", "brewery", "style", "abv", "ibu", "description"];

  function toStateFromValue(value) {
    var v = value || {};
    return {
      name: v.name || "",
      brewery: v.brewery || "",
      style: v.style || "",
      abv: v.abv != null ? String(v.abv) : "",
      ibu: v.ibu != null ? String(v.ibu) : "",
      description: v.description || "",
      catalogBeerId: v.catalogBeerId || null,
    };
  }

  var CatalogBeerSearchControl = createClass({
    getInitialState: function () {
      var base = toStateFromValue(this.props.value);
      base.query = "";
      base.results = [];
      base.searching = false;
      base.error = null;
      return base;
    },

    emitChange: function (partial) {
      var next = Object.assign({}, this.state, partial);
      this.setState(partial);
      this.props.onChange({
        name: next.name,
        brewery: next.brewery,
        style: next.style,
        abv: next.abv === "" ? null : Number(next.abv),
        ibu: next.ibu === "" ? null : Number(next.ibu),
        description: next.description,
        catalogBeerId: next.catalogBeerId,
      });
    },

    handleQueryChange: function (e) {
      this.setState({ query: e.target.value });
    },

    handleQueryKeyDown: function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        this.handleSearch();
      }
    },

    handleSearch: function () {
      var query = this.state.query.trim();
      if (!query) return;
      var self = this;
      self.setState({ searching: true, error: null, results: [] });
      fetch("/api/beer-search?q=" + encodeURIComponent(query))
        .then(function (res) {
          if (!res.ok) {
            return res.json().catch(function () {
              return {};
            }).then(function (body) {
              throw new Error(body.error || "Search failed (" + res.status + ")");
            });
          }
          return res.json();
        })
        .then(function (data) {
          self.setState({ searching: false, results: (data && data.data) || [] });
        })
        .catch(function (err) {
          self.setState({ searching: false, error: String((err && err.message) || err) });
        });
    },

    handleSelect: function (result) {
      this.emitChange({
        name: result.name || "",
        brewery: (result.brewer && result.brewer.name) || "",
        style: result.style || "",
        abv: result.abv != null ? String(result.abv) : "",
        ibu: result.ibu != null ? String(result.ibu) : "",
        description: result.description || "",
        catalogBeerId: result.id || null,
      });
      this.setState({ results: [], query: "" });
    },

    handleFieldChange: function (key) {
      var self = this;
      return function (e) {
        var partial = {};
        partial[key] = e.target.value;
        self.emitChange(partial);
      };
    },

    renderField: function (label, key, multiline) {
      var s = this.state;
      var inputProps = {
        value: s[key],
        onChange: this.handleFieldChange(key),
        style: { width: "100%", padding: "8px", boxSizing: "border-box" },
      };
      return h(
        "div",
        { key: key, style: { marginBottom: "10px" } },
        h(
          "label",
          { style: { fontSize: "12px", fontWeight: "bold", display: "block", marginBottom: "4px" } },
          label
        ),
        multiline
          ? h("textarea", Object.assign({ rows: 3 }, inputProps))
          : h("input", Object.assign({ type: "text" }, inputProps))
      );
    },

    render: function () {
      var s = this.state;
      var resultItems = s.results.map(
        function (r) {
          var breweryName = (r.brewer && r.brewer.name) || "";
          var meta = [breweryName, r.style, r.abv != null ? r.abv + "% ABV" : null]
            .filter(Boolean)
            .join(" · ");
          return h(
            "li",
            {
              key: r.id,
              onClick: this.handleSelect.bind(this, r),
              style: {
                padding: "8px",
                cursor: "pointer",
                borderBottom: "1px solid #eee",
              },
            },
            h("strong", {}, r.name),
            meta ? " — " + meta : ""
          );
        }.bind(this)
      );

      return h(
        "div",
        { className: this.props.classNameWrapper },
        h(
          "div",
          { style: { display: "flex", gap: "8px", marginBottom: "10px" } },
          h("input", {
            type: "text",
            placeholder: 'Search catalog.beer (e.g. "Sculpin IPA")',
            value: s.query,
            onChange: this.handleQueryChange,
            onKeyDown: this.handleQueryKeyDown,
            style: { flex: "1", padding: "8px" },
          }),
          h(
            "button",
            { type: "button", onClick: this.handleSearch },
            s.searching ? "Searching…" : "Search"
          )
        ),
        s.error ? h("p", { style: { color: "#a33", fontSize: "13px" } }, s.error) : null,
        s.results.length
          ? h(
              "ul",
              {
                style: {
                  listStyle: "none",
                  margin: "0 0 14px",
                  padding: "0",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  maxHeight: "220px",
                  overflowY: "auto",
                },
              },
              resultItems
            )
          : null,
        this.renderField("Beer name", "name"),
        this.renderField("Brewery", "brewery"),
        this.renderField("Style", "style"),
        h(
          "div",
          { style: { display: "flex", gap: "10px" } },
          h("div", { style: { flex: "1" } }, this.renderField("ABV %", "abv")),
          h("div", { style: { flex: "1" } }, this.renderField("IBU", "ibu"))
        ),
        this.renderField("Description", "description", true)
      );
    },
  });

  var CatalogBeerSearchPreview = createClass({
    render: function () {
      var v = this.props.value || {};
      if (!v.name) return h("p", {}, "(no beer selected yet)");
      return h(
        "div",
        {},
        h("strong", {}, v.name),
        v.brewery ? " — " + v.brewery : "",
        v.abv != null ? " (" + v.abv + "% ABV)" : ""
      );
    },
  });

  CMS.registerWidget("catalog-beer-search", CatalogBeerSearchControl, CatalogBeerSearchPreview);
})();
