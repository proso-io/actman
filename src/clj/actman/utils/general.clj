(ns actman.utils.general
  "Contains general utility functions")

(defn is-object-equal-for-keys?
  "Checks if value of keys in compare-obj equals to the value of keys in base-obj.
  `levels` is a vector of keys (defaults to keys of base-obj).
  The keys are compared in order provided in `levels`.
  `level` is the key in `levels` upto which keys are compared."
  ([base-obj compare-obj]
    (is-object-equal-for-keys? base-obj compare-obj (keys base-obj)))
  ([base-obj compare-obj levels]
    (is-object-equal-for-keys? base-obj compare-obj levels (last levels)))
  ([base-obj compare-obj levels level]
    (loop [n 0 match true]
      (let [
        l (nth levels n)
        match (and match (= (l base-obj) (l compare-obj)))
        ]
        (if-not (or (= l level) (= n (count levels)))
          (recur (inc n) match)
          match)
    ))))

(defn stringify-map-values
  [map-obj]
  (reduce #(str %1 " " (%2 map-obj)) "" (keys map-obj)))
