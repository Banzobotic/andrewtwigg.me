import { publish } from "gh-pages";

publish(
    "dist", 
    {
        cname: "andrewtwigg.me",
        nojekyll: true,
    },
    () => console.log("Deploy complete!"),
)