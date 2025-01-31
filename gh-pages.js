import { publish } from "gh-pages";

publish(
    "build",
    {
        branch: "gh-pages",
        repo: "https://github.com/Banzobotic/andrewtwigg.me.git",
        user: {
            name: "Banzobotic",
            email: "78510207+Banzobotic@users.noreply.github.com"
        },
        dotfiles: true
    },
    () => {
        console.log("Deploy Complete!"");
    }
);
