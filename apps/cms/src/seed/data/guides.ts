import { doc, p, t, link, h, ul, code, ps } from "./lexical";

type LexicalDoc = ReturnType<typeof doc>;

export type GuideSeedData = {
  title: string;
  slug?: string;
  description: string;
  category: "setup" | "development" | "tips";
  difficulty: "beginner" | "intermediate" | "advanced";
  readTime: string;
  icon: string;
  externalUrl?: string;
  order: number;
  content?: LexicalDoc;
};

const furtherReading = (links: { label: string; url: string }[]) => [
  h(2, "Further reading"),
  ul(...links.map((l) => [link(l.url, l.label)])),
];

export const guidesData: GuideSeedData[] = [
  {
    title: "Installing s&box",
    slug: "installing-sandbox",
    description:
      "Download and set up s&box on your machine. Get the editor running and verify everything works.",
    category: "setup",
    difficulty: "beginner",
    readTime: "5 min",
    icon: "download",
    order: 1,
    content: doc(
      ps(
        "s&box is a modern game engine built on Source 2 and .NET, distributed through Steam as a free developer preview from Facepunch. Installing it takes only a few minutes — you grab two Steam apps (the game and the editor), confirm your machine meets the hardware bar, and you're ready to launch. The whole platform is currently in open developer preview, so anyone with a Steam account can claim access.",
      ),

      h(2, "Claim access on Steam"),
      p(
        t("Head to "),
        link("https://sbox.game", "sbox.game"),
        t(
          " and sign in with Steam. The site will offer to add s&box to your Steam library — accept it. Because s&box is a developer preview rather than a paid release, there is no purchase step and no invite key required. Once it is on your account, the s&box game and the s&box editor will appear as separate Steam apps that you can install independently, just like any other Steam title.",
        ),
      ),

      h(2, "Install both apps from your Library"),
      ps(
        "Open Steam, switch to the Library tab and search for 's&box'. You will see two separate entries: the runtime (which actually plays games published to the platform) and the editor (the development tool used to build them). Install both — the editor depends on the runtime for testing your project, and the runtime alone will not let you create games. The official docs note you can install s&box directly with the steam://run/2129370 protocol link.",
      ),

      h(2, "Check the system requirements"),
      ps(
        "s&box is a Source 2 engine and a Vulkan/DX12 renderer, so it has stricter graphics requirements than most engines. Officially you need Windows 10 64-bit, an Intel Core i5-7500 or Ryzen 5 1600, 8 GB RAM, and a 4 GB VRAM GPU like a GTX 1050 or RX 570. Recommended is Windows 11, an i7-9700K or Ryzen 7 3700, 16 GB RAM, and an RTX 2060 or RX 6600 XT. Crucially, integrated Intel graphics are not supported (AMD Ryzen APU graphics are fine), and you need around 12 GB of free storage for the base install plus much more once you start downloading cloud assets.",
      ),

      h(2, "Launch the editor"),
      ps(
        "Once installed, you can launch s&box in three ways: from your Steam Library by hitting Play on the 's&box editor' entry, by pinning a desktop shortcut to sbox-dev.exe (located in the editor's install folder), or by double-clicking any .sbproj file to open that project directly in the editor. The first launch can take a minute as the engine compiles shaders and pulls down core assets.",
      ),

      ...furtherReading([
        {
          label: "Download & Install (official docs)",
          url: "https://docs.facepunch.com/s/sbox-dev/doc/dev-preview-first-steps-7IyiSplYmn",
        },
        {
          label: "FAQ",
          url: "https://docs.facepunch.com/s/sbox-dev/doc/faq-sV2ZwDvc6K",
        },
        {
          label: "Reporting Errors / troubleshooting first launch",
          url: "https://docs.facepunch.com/s/sbox-dev/doc/reporting-errors-2OTPIafqCJ",
        },
      ]),
    ),
  },

  {
    title: "Setting Up Your Dev Environment",
    slug: "setting-up-your-dev-environment",
    description:
      "Configure your IDE, install extensions, and set up hot-reload for a smooth development workflow.",
    category: "setup",
    difficulty: "beginner",
    readTime: "10 min",
    icon: "code",
    order: 2,
    content: doc(
      ps(
        "s&box uses C# end-to-end, and the engine is designed to live next to your IDE rather than replace it — when you save a .cs or .razor file, the engine recompiles and live-reloads the new code into the running game in milliseconds. That means a comfortable IDE setup pays off immediately. Visual Studio, JetBrains Rider, and VS Code are all first-class.",
      ),

      h(2, "Open the generated solution"),
      ps(
        "Every s&box project is a .NET solution. When you open a project in the editor it generates a .sln file at the root of the project folder alongside the .sbproj. Double-clicking the .sln launches Visual Studio (or whichever IDE you have associated with .sln files) with all the right project references — including Sandbox.Game, Sandbox.System, and the engine's source-generated code. If you also have an editor folder in your project, you'll get a second project named <YourProject>.editor that can reference both tools and game code.",
      ),

      h(2, "Use any of the supported IDEs"),
      ps(
        "Visual Studio 2022 (the free Community edition is fine) is the most-tested option. JetBrains Rider works equally well — point it at the generated .sln and Rider will pick up the Sandbox SDK assemblies automatically. VS Code is supported for lighter editing, with an official Facepunch/sbox-vscode extension that adds Razor and shader-graph awareness. There is no special build step you need to run from the IDE; the engine itself owns compilation.",
      ),

      h(2, "Trust hot reload, don't rebuild manually"),
      ps(
        "Save the file, alt-tab to s&box, and your change is already live. The hotload system patches IL into the running process, so method-body changes are nearly instant; bigger structural changes (adding fields, renaming types) trigger a heap walk to upgrade existing instances. You don't run dotnet build — in fact, building from the IDE is unnecessary and can confuse the engine's own compiler. If something gets stuck, type 'hotload_log 2' in the s&box console to see what's slow or leaking, and restart the editor as a last resort.",
      ),
      code(
        `// Save this file in your IDE — the new value of Speed is live in s&box
// the next frame, no rebuild required.
using Sandbox;

public sealed class Mover : Component
{
    [Property] public float Speed { get; set; } = 250f;

    protected override void OnUpdate()
    {
        WorldPosition += Vector3.Forward * Speed * Time.Delta;
    }
}`,
      ),

      h(2, "Know the API whitelist"),
      ps(
        "Platform games (anything you publish to sbox.game) run under an API whitelist that blocks risky .NET surface area like System.IO and arbitrary reflection. Your IDE will see those types, but the s&box compiler will emit an SB1000 'Whitelist Error' when you use one. Use Log.Info instead of Console.WriteLine, and use the Sandbox FileSystem API instead of System.IO. Standalone exports can opt out of the whitelist, but they cannot then be published back to the platform.",
      ),

      h(2, "Working project layout"),
      ps(
        "A typical project folder contains the .sbproj manifest, a Code/ folder for your C#, an Assets/ folder for art and prefabs, optional editor/ and shaders/ folders, and the auto-generated .sln + obj/ folders for the IDE. You commit Code/, Assets/, the .sbproj, and editor configs; you ignore obj/, bin/, .vs/, and .idea/ (see the team workflow guide for a full .gitignore).",
      ),

      ...furtherReading([
        {
          label: "Hotloading internals",
          url: "https://docs.facepunch.com/s/sbox-dev/doc/codegen-zhqowLeADO",
        },
        {
          label: "Editor Project structure",
          url: "https://docs.facepunch.com/s/sbox-dev/doc/editor-project-LuRHQgnNjC",
        },
        {
          label: "First Steps",
          url: "https://docs.facepunch.com/s/sbox-dev/doc/dev-preview-first-steps-7IyiSplYmn",
        },
        {
          label: "Editor Shortcuts",
          url: "https://docs.facepunch.com/s/sbox-dev/doc/editor-shortcuts-S8zYFGPAjK",
        },
      ]),
    ),
  },

  {
    title: "Creating Your First Project",
    slug: "creating-your-first-project",
    description:
      "Bootstrap a new s&box game project from scratch. Understand the project structure and build pipeline.",
    category: "setup",
    difficulty: "beginner",
    readTime: "15 min",
    icon: "rocket_launch",
    order: 3,
    content: doc(
      ps(
        "Creating a game project in s&box is just a few clicks: pick a template from the welcome screen, give it a folder, and the editor generates a fully-working scene plus a C# project you can immediately run, edit, and (when ready) export to a standalone executable. Everything in your project lives next to a .sbproj manifest file, which is the entry point for the editor.",
      ),

      h(2, "Start from a template"),
      ps(
        "Launch sbox-dev and on the welcome screen click 'New Project'. The Minimal Game template is the right starting point for a jam — it gives you an empty scene, a default camera, and a small amount of scaffolding without forcing a particular genre on you. Pick a folder outside of your Steam install (somewhere you'll source-control) and the editor creates the project there. The .sbproj file it writes is just JSON metadata: title, type, identifier, package settings.",
      ),

      h(2, "Understand the project files"),
      ps(
        "After creation you'll see a tree like Code/, Assets/, and the .sbproj at the root. Code/ is where your .cs and .razor files live and is the C# project the editor compiles. Assets/ contains scenes (.scene), prefabs (.prefab), models (.vmdl), materials (.vmat), sounds (.sound/.vsnd), and any other content. The editor also generates a .sln so Visual Studio or Rider can open the project. The .sbproj also declares your project type — Game, Addon, or Tool — and Game is what you want for a jam entry.",
      ),

      h(2, "Add a GameObject and a Component"),
      ps(
        "Right-click in the scene tree (left panel) and create an empty GameObject, then in the Inspector click 'Add Component' and either pick a built-in one (ModelRenderer, BoxCollider, Camera, etc.) or type a new name to scaffold a custom one — the editor will create the .cs file and open it in your IDE. Save the file and the engine hotloads your component into the running scene immediately.",
      ),
      code(
        `using Sandbox;

public sealed class Spinner : Component
{
    [Property] public float DegreesPerSecond { get; set; } = 90f;

    protected override void OnUpdate()
    {
        WorldRotation *= Rotation.FromYaw( DegreesPerSecond * Time.Delta );
    }
}`,
      ),

      h(2, "Press Play, iterate, repeat"),
      ps(
        "Hit the Play button at the top of the editor to enter Play mode in the same window. While playing you can keep editing C# in your IDE — saves hotload into the running game. You can also pause, step, and inspect any GameObject in the Scene panel. To stop, press the Stop button or escape the play session. Iteration is the whole point: small change, save, see the result.",
      ),

      h(2, "Export when you're ready"),
      ps(
        "When the jam ends, you have two ways to ship: publish to the s&box platform via Edit → Publish (the player jumps into your game from sbox.game), or export a standalone .exe via Project → Export. The Export Wizard asks for an icon, splash image, and a Steam App ID, then writes a self-contained build to a folder you choose. Standalone exports are royalty-free and have no whitelist, but at the time of writing distribution still requires Valve approval — for a jam, publishing to the platform is the easiest route.",
      ),

      ...furtherReading([
        {
          label: "First Steps",
          url: "https://docs.facepunch.com/s/sbox-dev/doc/dev-preview-first-steps-7IyiSplYmn",
        },
        {
          label: "Game Exporting",
          url: "https://docs.facepunch.com/s/sbox-dev/doc/game-exporting-mFcXDhYAib",
        },
        {
          label: "Editor Project",
          url: "https://docs.facepunch.com/s/sbox-dev/doc/editor-project-LuRHQgnNjC",
        },
        {
          label: "Addon Project",
          url: "https://docs.facepunch.com/s/sbox-dev/doc/addon-project-hUCwPwjvj2",
        },
      ]),
    ),
  },

  {
    title: "Understanding the Component System",
    slug: "understanding-the-component-system",
    description:
      "Learn how scenes, GameObjects, and Components work in s&box — properties, lifecycle hooks, and execution order.",
    category: "development",
    difficulty: "intermediate",
    readTime: "20 min",
    icon: "hub",
    order: 4,
    content: doc(
      ps(
        "s&box no longer uses the old Source-style Entity model — the engine moved to a scene system inspired by Unity and Godot, where everything is a GameObject with a Transform, and behaviour comes from Components attached to those GameObjects. Your gameplay code is almost always a class deriving from Sandbox.Component, with [Property] fields exposed to the editor and lifecycle methods you override. Scenes are JSON files on disk; GameObjects can be nested into hierarchies; Components are the reusable building blocks of your game.",
      ),

      h(2, "GameObject: the world object"),
      ps(
        'A GameObject has a Transform (position, rotation, scale), Tags (used for collision filtering, camera include/exclude, and arbitrary game logic), Children (a list of nested GameObjects), and a list of Components. Children inherit their parent\'s transform, so moving the parent moves them with it. You create one with `var go = new GameObject();`, find one with `Scene.Directory.FindByName("Cube").First()`, and destroy it with `go.Destroy()`. World position is exposed as `go.WorldPosition` and parent-relative position as `go.LocalPosition`.',
      ),
      code(
        `var enemy = new GameObject();
enemy.Name = "Enemy";
enemy.WorldPosition = new Vector3( 100, 0, 50 );
enemy.Tags.Add( "enemy" );

var renderer = enemy.AddComponent<ModelRenderer>();
renderer.Model = Model.Load( "models/dev/box.vmdl" );
renderer.Tint = Color.Red;`,
      ),

      h(2, "Component: where your code lives"),
      ps(
        "A Component is a C# class deriving from Sandbox.Component that you attach to a GameObject. You add one in the editor by selecting the GameObject and clicking 'Add Component', or in code with go.AddComponent<T>(). Components access their owner via the GameObject property and the scene via Scene. You can query siblings with GetComponent<T>(), and ancestors/descendants with GetComponentInParent<T>() / GetComponentInChildren<T>(). Removing a component is component.Destroy().",
      ),

      h(2, "[Property] exposes fields to the editor"),
      ps(
        "Mark a property with [Property] and it appears in the Inspector for designers to tweak, and is serialized into the scene JSON. [RequireComponent] will auto-create a referenced sibling component if missing. Other useful attributes include [Range(min, max)] for sliders, [TextArea] for multi-line strings, and [Sync] (covered in the networking guide) for replicated state. Properties are also visible in prefab overrides, which makes them the primary knob designers use.",
      ),
      code(
        `using Sandbox;

public sealed class Health : Component
{
    [Property, Range( 1, 1000 )] public float Max { get; set; } = 100f;
    [Property] public float Current { get; set; } = 100f;
    [RequireComponent] public ModelRenderer Renderer { get; set; }

    public void TakeDamage( float amount )
    {
        Current = MathF.Max( 0, Current - amount );
        if ( Current <= 0 ) GameObject.Destroy();
    }
}`,
      ),

      h(2, "Lifecycle: OnAwake, OnStart, OnUpdate, OnDestroy"),
      ps(
        "Override the methods you need: OnAwake runs once when the component is created (after deserialization), OnStart runs the first time the component becomes enabled and is guaranteed to fire before the first OnFixedUpdate, OnUpdate runs every frame, OnFixedUpdate runs every fixed timestep (use this for player movement and physics), OnPreRender runs after animation but before drawing, OnEnabled / OnDisabled fire on toggle, and OnDestroy runs when the component or its GameObject is destroyed. There is also an async OnLoad you can override to defer scene-load completion (the loading screen waits for it).",
      ),
      code(
        `using Sandbox;

public sealed class PatrolBot : Component
{
    private Vector3 _origin;

    protected override void OnAwake()
    {
        Log.Info( $"{GameObject.Name} awoke" );
    }

    protected override void OnStart()
    {
        _origin = WorldPosition;
    }

    protected override void OnFixedUpdate()
    {
        var offset = MathF.Sin( Time.Now ) * 100f;
        WorldPosition = _origin + Vector3.Forward * offset;
    }

    protected override void OnDestroy()
    {
        Log.Info( $"{GameObject.Name} destroyed" );
    }
}`,
      ),

      h(2, "Don't rely on cross-object execution order"),
      ps(
        "Within a single component the lifecycle is deterministic, but the order in which the same callback runs across different GameObjects is not. If you need a global tick that happens once per frame at a known time — game managers, score, round logic — derive from GameObjectSystem<T> instead of putting it on a per-object component. Systems hook into specific scene stages (Stage.StartUpdate, Stage.PhysicsStep, etc.) and run with predictable timing.",
      ),

      ...furtherReading([
        {
          label: "Component Methods (full lifecycle)",
          url: "https://docs.facepunch.com/s/sbox-dev/doc/component-methods-OCvoNh8ByW",
        },
        {
          label: "GameObject reference",
          url: "https://docs.facepunch.com/s/sbox-dev/doc/gameobject-oUVQQzT4IO",
        },
        {
          label: "Scenes",
          url: "https://docs.facepunch.com/s/sbox-dev/doc/scenes-LT2kjsMBy4",
        },
        {
          label: "Cheat Sheet (common GameObject/Component code)",
          url: "https://docs.facepunch.com/s/sbox-dev/doc/cheat-sheet-CH6MPz8N2j",
        },
      ]),
    ),
  },

  {
    title: "Working with UI (Razor)",
    slug: "working-with-ui-razor",
    description:
      "Build in-game UI using Razor components. Create HUDs, menus, and interactive panels.",
    category: "development",
    difficulty: "intermediate",
    readTime: "25 min",
    icon: "dashboard",
    order: 5,
    content: doc(
      ps(
        "s&box UI is built from Panels — C# objects that lay out using a flexbox stylesheet engine. You can construct them entirely in code, but most games use Razor files (.razor) that mix HTML-like markup with inline C#, similar to ASP.NET Blazor. Panels render natively (there is no actual HTML engine under the hood), which makes them fast and well-integrated with the scene system.",
      ),

      h(2, "Panel, PanelComponent, ScreenPanel, WorldPanel"),
      ps(
        "Panel is the base UI building block (any node in the UI tree). PanelComponent is a Component that owns a root Panel and is added to a GameObject — it's how UI gets into the scene. To actually draw the UI, the GameObject also needs either a ScreenPanel component (for HUDs and full-screen menus, drawn in 2D over the camera) or a WorldPanel component (for 3D in-world UI like signs and health bars). One PanelComponent feeds one ScreenPanel or one WorldPanel.",
      ),

      h(2, "Make a Razor panel"),
      ps(
        "In the editor, right-click a folder under Code/ and choose 'New Razor Panel Component'. You'll get a paired .razor file (markup + @code block) that inherits from PanelComponent. Anything inside <root> is your panel's children; everything in @code is normal C#. Add [Property] fields just like a regular Component and they show up in the Inspector. Override BuildHash() so the panel only re-renders when its inputs change — this is critical for performance.",
      ),
      code(
        `@using Sandbox;
@using Sandbox.UI;
@inherits PanelComponent

<root>
    <div class="hud">
        <div class="hp">HP: @Health</div>
        <div class="score">@Score</div>
    </div>
</root>

@code
{
    [Property] public int Health { get; set; } = 100;
    [Property] public int Score { get; set; } = 0;

    protected override int BuildHash() => System.HashCode.Combine( Health, Score );
}`,
        "razor",
      ),

      h(2, "Style with paired .scss"),
      ps(
        'If you create a file next to your panel with the same name plus .scss (e.g. Hud.razor and Hud.razor.scss) it is automatically loaded as that panel\'s stylesheet. You can also add an explicit [StyleSheet("main.scss")] attribute on a Panel class, write inline <style> blocks before or after <root>, or set styles in code via Panel.Style.Width = Length.Percent(50). The stylesheet syntax is SCSS with most CSS3 layout features — flexbox, grid is partial, transitions, hover, etc.',
      ),
      code(
        `.hud {
    position: absolute;
    bottom: 32px;
    left: 32px;
    font-family: Poppins;
    color: white;
}

.hud .hp {
    font-size: 28px;
    font-weight: 700;
    text-shadow: 0 2px 4px rgba(0,0,0,0.6);
}

.hud .score {
    font-size: 20px;
    opacity: 0.85;
}`,
        "scss",
      ),

      h(2, "Compose Razor components and pass props"),
      ps(
        'Make smaller .razor files that derive from Panel (the default for .razor files), then drop them into a parent panel like a tag: <HealthBar Value=@(player.Health) />. You can store a reference with <HealthBar @ref="_bar" /> and read/write its properties from C#. Use :bind for two-way binding (<SliderEntry Value:bind=@MyValue />). For repeating content use a Razor @foreach loop — re-render is gated by your BuildHash, so include the loop\'s source data in the hash.',
      ),

      h(2, "Force a rebuild"),
      ps(
        "By default the engine only rebuilds a panel's children when its BuildHash changes (or when the user mouses over a pointer-events panel). If you need to force a rebuild — for example after an async operation completes — call StateHasChanged() and the rebuild is queued for the next frame. Avoid building heavy logic in the markup itself; do it in @code and just read the result in <root>.",
      ),

      ...furtherReading([
        {
          label: "Razor Components",
          url: "https://docs.facepunch.com/s/sbox-dev/doc/razor-components-UI4r9NrDOY",
        },
        {
          label: "Style Properties",
          url: "https://docs.facepunch.com/s/sbox-dev/doc/style-properties-WSPC2zsKHu",
        },
        {
          label: "HudPainter (immediate-mode HUD drawing)",
          url: "https://docs.facepunch.com/s/sbox-dev/doc/hudpainter-iOOuBWtIP8",
        },
      ]),
    ),
  },

  {
    title: "Networking & Multiplayer",
    slug: "networking-and-multiplayer",
    description:
      "Implement multiplayer features — RPCs, networked properties, host/client architecture.",
    category: "development",
    difficulty: "advanced",
    readTime: "30 min",
    icon: "lan",
    order: 6,
    content: doc(
      ps(
        "s&box's networking model is intentionally simple: one player is the host, the rest are clients, and the host has authority by default. You mark properties as replicated with [Sync], call cross-machine methods with [Rpc.Broadcast] / [Rpc.Owner] / [Rpc.Host], and spawn networked GameObjects with NetworkSpawn(). The Networking static class handles lobbies and connections. It is not a server-authoritative AAA stack — it's designed for small co-op and party games, which is exactly what game jams need.",
      ),

      h(2, "Lobbies and connections"),
      ps(
        "Use the static Networking class to create or join games. Networking.CreateLobby opens a lobby on Steam with a max player count and a privacy setting (Public, FriendsOnly, Private). Networking.QueryLobbies returns a list you can present in a server browser. Networking.Connect(lobbyId) joins one. The host's scene becomes the source of truth — joining clients receive a full snapshot of every networked GameObject.",
      ),
      code(
        `// Host: open a lobby
Networking.CreateLobby( new LobbyConfig
{
    MaxPlayers = 8,
    Privacy = LobbyPrivacy.Public,
    Name = "Jam Game"
} );

// Client: list lobbies, join one
var lobbies = await Networking.QueryLobbies();
Networking.Connect( lobbies.First().LobbyId );`,
      ),

      h(2, "[Sync] for replicated state"),
      ps(
        '[Sync] on a property of a Component automatically replicates the value from its owner to everyone else. Supported types are unmanaged value types, string, and a few engine-special references (GameObject, Component, GameResource). The owner of the object writes; everyone else reads. For collections, use the special NetList<T> and NetDictionary<K,V> types. Combine with [Change("OnNameChanged")] to fire a callback when the value updates on a remote machine.',
      ),
      code(
        `using Sandbox;

public sealed class Player : Component
{
    [Sync] public int Kills { get; set; }
    [Sync] public string DisplayName { get; set; }
    [Sync, Change("OnHealthChanged")] public float Health { get; set; } = 100f;

    [Sync] public NetList<int> Inventory { get; set; } = new();

    private void OnHealthChanged( float oldValue, float newValue )
    {
        if ( newValue <= 0 ) PlayDeathFx();
    }

    void PlayDeathFx() { /* ... */ }
}`,
      ),

      h(2, "RPCs: Broadcast, Owner, Host"),
      ps(
        "An RPC is a method that, when called locally, also executes on remote machines. [Rpc.Broadcast] runs everywhere (use it for visual/audio effects you want everyone to see). [Rpc.Owner] runs only on the owner of the networked object (or the host if it has no owner). [Rpc.Host] runs only on the host (good for authoritative actions like 'request damage'). RPCs can be static and can carry the same argument types as [Sync] properties. Pass NetFlags.Unreliable for cheap fire-and-forget messages, and use Rpc.Caller to learn who invoked the method.",
      ),
      code(
        `using Sandbox;

public sealed class Bomb : Component
{
    public void Detonate()
    {
        // Local effect; ask everyone to play it too
        PlayExplosionFx( WorldPosition );
    }

    [Rpc.Broadcast( NetFlags.Unreliable )]
    public void PlayExplosionFx( Vector3 position )
    {
        Sound.Play( "explosion", position );
    }

    [Rpc.Host]
    public void RequestDamage( int amount )
    {
        // Only the host applies damage authoritatively
        var caller = Rpc.Caller;
        Log.Info( $"Damage requested by {caller.DisplayName}" );
    }
}`,
      ),

      h(2, "Spawning networked GameObjects and ownership"),
      ps(
        "By default GameObjects in the scene are sent as part of the initial snapshot to joining clients (NetworkMode.Snapshot). To create a networked object at runtime, clone a prefab and call NetworkSpawn() — pass a Connection to assign that client as the owner. The owner simulates the object: their machine writes its transform and [Sync] properties, everyone else interpolates. Check IsProxy in your update loop to skip control logic on machines that aren't the owner. Ownership can be transferred with go.Network.TakeOwnership().",
      ),
      code(
        `using Sandbox;

public sealed class GameNetworkManager : Component, Component.INetworkListener
{
    [Property] public GameObject PlayerPrefab { get; set; }
    [Property] public GameObject SpawnPoint { get; set; }

    public void OnActive( Connection connection )
    {
        var player = PlayerPrefab.Clone( SpawnPoint.WorldTransform );
        player.NetworkSpawn( connection ); // 'connection' becomes the owner
    }
}

public sealed class PlayerMovement : Component
{
    protected override void OnUpdate()
    {
        if ( IsProxy ) return; // only the owner reads input

        if ( !Input.AnalogMove.IsNearZeroLength )
            WorldPosition += Input.AnalogMove.Normal * Time.Delta * 250f;
    }
}`,
      ),

      h(2, "Test multiplayer locally"),
      ps(
        "You don't need a friend to test. With your project running, click the network status icon in the editor's header bar and choose 'Join via new instance' — a second sbox-dev process spawns and joins your session. Code changes hot-reload to all connected clients, so you can iterate while two clients are live. You can also run 'connect local' in the console of a separately-launched s&box client.",
      ),

      ...furtherReading([
        {
          label: "Networking & Multiplayer overview",
          url: "https://docs.facepunch.com/s/sbox-dev/doc/networking-multiplayer-kaVboe3yRD",
        },
        {
          label: "Sync Properties",
          url: "https://docs.facepunch.com/s/sbox-dev/doc/sync-properties-jKFHwTGVgR",
        },
        {
          label: "RPC Messages",
          url: "https://docs.facepunch.com/s/sbox-dev/doc/rpc-messages-u5EwxSsBrD",
        },
        {
          label: "Ownership",
          url: "https://docs.facepunch.com/s/sbox-dev/doc/ownership-7rMV3FABuV",
        },
      ]),
    ),
  },

  {
    title: "Asset Creation Pipeline",
    slug: "asset-creation-pipeline",
    description:
      "Import models, textures, and sounds into your s&box project. Understand the asset compiler.",
    category: "development",
    difficulty: "intermediate",
    readTime: "20 min",
    icon: "view_in_ar",
    order: 7,
    content: doc(
      ps(
        "Because s&box is built on Source 2, your assets compile into the same .vmdl, .vmat, .vtex, and .vsnd_c formats Valve uses for CS2 and Half-Life: Alyx. The good news is that the editor handles compilation automatically — you drop a source file (FBX, OBJ, PNG, WAV) into your project's Assets/ folder and the engine spits out the compiled binary on the fly. Models are configured in ModelDoc, materials in the Material Editor, and everything is browsed in the Asset Browser panel.",
      ),

      h(2, "Importing models with ModelDoc (.vmdl)"),
      ps(
        "ModelDoc is the editor for .vmdl files — the modern replacement for Source 1's text-based .qc compile scripts. Drop an FBX, OBJ, DMX, SMD, or VOX into your Assets/ folder and create or open a .vmdl alongside it; ModelDoc opens with a node graph. The minimum you need is a RenderMeshFile node pointing at your source mesh; for animated meshes also add an AnimBindPose (or AnimFile) so morph targets and IK don't silently break. Export FBX as binary (not ASCII) since Blender can only re-import binary, and avoid periods in material names — everything after the period gets truncated. Find ModelDoc under the Tools menu in the editor.",
      ),

      h(2, "Materials (.vmat) and textures"),
      ps(
        "A .vmat is a Source 2 material — it pairs a shader with a set of textures and parameters. Open the Material Editor, pick a shader (Complex is the default PBR shader), and assign Color, Normal, Roughness/Metalness textures. Source images can be PNG, TGA, or PSD; the engine compiles them to .vtex_c on save. For a model with multiple slots, the .vmdl looks up materials by the names embedded in your FBX, so keep those names short, lowercase, and free of dots.",
      ),

      h(2, "Sound assets (.sound and .vsnd)"),
      ps(
        'Drop a .wav or .mp3 into Assets/ and create a .sound file next to it. The .sound is a small JSON resource that wraps your raw audio with parameters: volume, pitch range, distance falloff, mix group. You then load it in code with Sound.Play("my_sound") or Sound.FromWorld("my_sound", position) for spatialised playback. Use .sound files (not raw .wav) so designers can tweak volume and randomisation without touching code.',
      ),
      code(
        `// Play a sound at a world position
Sound.Play( "sounds/coin_pickup.sound" );
Sound.FromWorld( "sounds/explosion.sound", WorldPosition );

// Load a model and apply a material from code
var renderer = GameObject.AddComponent<ModelRenderer>();
renderer.Model = Model.Load( "models/jam/crate.vmdl" );
renderer.MaterialOverride = Material.Load( "materials/jam/crate_red.vmat" );`,
      ),

      h(2, "The Asset Browser"),
      ps(
        "Open the Asset Browser panel (Window → Asset Browser if it's not visible) to see every asset in your project, plus mounted content from base s&box and any cloud asset packs you've subscribed to on sbox.game. You can drag a .vmdl into the scene to spawn a ModelRenderer, drag a .prefab to instantiate it, or right-click a folder to create new assets in place. The Asset Browser is also where you publish individual assets to the platform.",
      ),

      h(2, "Use cloud assets to save time in a jam"),
      ps(
        "sbox.game hosts thousands of community-published assets — characters, weapons, props, environments — that you can mount into your project for free. Browse them on the website or in the editor's Asset Browser, click 'Add to Project', and they appear in your Mounts. For a jam, leaning on the Citizen player model and free environment kits will save you days of work; the docs even ship the Citizen source files at sbox/addons/citizen so you can extend rather than replace.",
      ),

      ...furtherReading([
        {
          label: "Model Editor (ModelDoc)",
          url: "https://docs.facepunch.com/s/sbox-dev/doc/model-editor-gRGxG42apy",
        },
        {
          label: "Editor overview",
          url: "https://docs.facepunch.com/s/sbox-dev/doc/editor-tuqJFIQJaj",
        },
        {
          label: "Cheat Sheet",
          url: "https://docs.facepunch.com/s/sbox-dev/doc/cheat-sheet-CH6MPz8N2j",
        },
      ]),
    ),
  },

  {
    title: "Scoping Your Project",
    slug: "scoping-your-project",
    description:
      "How to plan a game you can actually finish in 72 hours. Start small, cut features early, and polish what matters.",
    category: "tips",
    difficulty: "beginner",
    readTime: "8 min",
    icon: "target",
    order: 8,
    content: doc(
      ps(
        "The single most common reason jam games don't ship is scope. You have a long weekend, not a long career — pick something small enough that the boring middle 60% (UI, win condition, polish, audio) actually fits. Treat scope as a design constraint, not a guess.",
      ),

      h(2, "Pick one verb"),
      ps(
        "Great jam games can usually be described by a single verb: jump, throw, hide, build, paint, sneak. Pick yours, and design every system to make that verb feel good. If you find yourself adding a second verb in the first day, drop it or cut something else. 'It's a stealth game where you also craft and trade' is two jams' worth of work; 'it's a stealth game' is one.",
      ),

      h(2, "Cut the scope in half, then in half again"),
      ps(
        "Whatever you originally pitched, halve it. Then look at what's left and halve it again. The remaining quarter is roughly what you'll actually finish to a polished state. The discarded three-quarters can come back as stretch goals once the quarter is shippable. Real designers do this; it's not pessimism, it's planning around how slow real iteration is.",
      ),

      h(2, "Build a vertical slice on day one"),
      ps(
        "By the end of the first day, get one minute of gameplay end-to-end: title screen → play → win or lose → return to title. It will be ugly and shallow, but it will be playable. From there you only widen and polish; you never start a system you can't finish. If you can't ship a vertical slice in a day, your scope is wrong, full stop.",
      ),

      h(2, "Lean on what s&box gives you free"),
      ps(
        "Use the Citizen player model, the built-in PlayerController for first/third person, NetworkHelper for multiplayer scaffolding, free cloud assets from sbox.game for environments and props, and the standard ModelRenderer/CameraComponent for the basics. Custom shaders, custom physics, custom networking layers, and custom animation graphs are jam killers — every hour you spend on infra is an hour you don't spend on what makes your game memorable.",
      ),

      h(2, "Have a 'done' definition"),
      ps(
        "Before you start, write down what 'finished' looks like in one sentence. 'Two players race a kart around three tracks and the fastest wins' is a clear finish line. 'A platformer with cool mechanics' is not. When you're tempted to add a feature mid-jam, hold it up against the finish line — if it's not on the path, it doesn't go in.",
      ),
    ),
  },

  {
    title: "Working Effectively as a Team",
    slug: "working-effectively-as-a-team",
    description:
      "Communication strategies, task splitting, version control tips, and avoiding merge conflicts during a jam.",
    category: "tips",
    difficulty: "beginner",
    readTime: "10 min",
    icon: "handshake",
    order: 9,
    content: doc(
      ps(
        "Game jams are won by communication as much as by code. A small team that has agreed on file ownership, a git workflow, and a daily check-in will out-ship a more talented team that hasn't. s&box projects play well with git, but you need to ignore the right folders and watch out for binary asset conflicts.",
      ),

      h(2, "Set up the repo with a good .gitignore"),
      ps(
        "Track Code/, Assets/, the .sbproj, and any .scss/.razor/.shader source files. Ignore obj/, bin/, .vs/, .idea/, and .vscode/ (unless you specifically want to share VS Code settings). Also ignore the auto-generated .sln if your team uses different IDEs — it can be regenerated by opening the project. Don't ignore .meta or .scene files — those are your scene graph and prefab references; lose them and your scenes break.",
      ),
      code(
        `# .gitignore for an s&box project

# IDE / build output
obj/
bin/
.vs/
.idea/
.vscode/
*.user
*.suo

# Auto-generated solution (let each dev regenerate)
*.sln

# OS junk
.DS_Store
Thumbs.db

# Local-only logs and caches
*.log
logs/
`,
        "gitignore",
      ),

      h(2, "Treat scenes and prefabs as locked files"),
      ps(
        ".scene and .prefab files are JSON, so git can technically merge them, but a real merge of two people's scene edits almost always corrupts something subtle (missing GameObjects, broken component references). The pragmatic rule for a jam: only one person edits a given scene or prefab at a time. Communicate before you open Main.scene. Use git LFS or just git for binary assets like .vmdl source FBXs and textures, and again coordinate edits.",
      ),

      h(2, "Split work along Component boundaries"),
      ps(
        "Components are the perfect unit of ownership. Designate one person per major Component (PlayerMovement, EnemyAI, ScoreManager, HudPanel) and they own that file. Multiple Components on the same GameObject can be edited by different people in parallel without merge conflicts, because each is its own .cs file. Reserve scene wiring (dragging Components together in the Inspector) as a synchronous, one-person-at-a-time task.",
      ),

      h(2, "Use small, frequent commits"),
      ps(
        "Commit every working change — when a feature compiles and the game still runs, push. Don't sit on a branch for six hours; you'll either step on a teammate's edits or lose work. If you must do a big risky refactor, branch, but rebase onto main daily. Small commits also make it trivial to revert when the polish phase reveals that yesterday's 'cool' system actually broke the win condition.",
      ),

      h(2, "Talk every few hours"),
      ps(
        "Open a voice channel and stay in it. Every few hours, do a thirty-second sync: what are you on, what's blocking you, what's next. This catches problems while they're cheap — the artist who's been blocked for an hour because they don't know the texture naming convention, the programmer who didn't realise design changed the win condition. Async docs help too: pin a list of agreed mechanics, controls, and asset specs somewhere everyone can see.",
      ),
    ),
  },

  {
    title: "Polishing for Submission",
    slug: "polishing-for-submission",
    description:
      "Last-hour tips: juice, screen shake, particles, sound effects, and a proper main menu make a huge difference.",
    category: "tips",
    difficulty: "intermediate",
    readTime: "12 min",
    icon: "auto_fix_high",
    order: 10,
    content: doc(
      ps(
        "The gap between a finished jam game and a winning jam game is almost always polish — the small things that make a game feel alive. Juice it. Players forgive a thin idea executed with care; they will not forgive a great idea that feels like a tech demo. Save the last day of the jam exclusively for polish.",
      ),

      h(2, "Add juice to every interaction"),
      ps(
        "Every meaningful action in the game should react: a hit registers with a particle, a sound, a screenshake, a brief hitstop, and a number popping out of the target. None of these are individually impressive; together they make the game feel like an event is happening rather than an integer changing. Pick three or four 'core actions' (jumping, hitting, picking up, scoring) and over-react to them.",
      ),
      code(
        `using Sandbox;

public sealed class HitFeedback : Component
{
    [Property] public CameraComponent Camera { get; set; }
    [Property] public SoundEvent HitSfx { get; set; }

    public void OnHit( Vector3 position )
    {
        // Sound
        Sound.Play( HitSfx, position );

        // Brief screen shake
        var shake = Camera.AddComponent<CameraShake>();
        shake.Amplitude = 4f;
        shake.Duration = 0.15f;

        // Hitstop
        _ = HitstopAsync( 0.06f );
    }

    private async Task HitstopAsync( float seconds )
    {
        Game.TimeScale = 0.05f;
        await Task.DelayRealtimeSeconds( seconds );
        Game.TimeScale = 1f;
    }
}`,
      ),

      h(2, "Sound is half the polish"),
      ps(
        "A silent game feels broken even when it isn't. Every interaction needs a sound, even if it's a placeholder you record on your phone. UI clicks, footsteps, ambient loops, a music track that loops without seams. Free libraries like Freesound, OpenGameArt, and Kenney's audio packs cover 90% of jam needs. Add a music slider in the menu so judges with headphones don't quit when your soundtrack is louder than they expect.",
      ),

      h(2, "Title, pause, restart"),
      ps(
        "Your game needs a title screen with the name of the game, a Play button, and credits — judges open dozens of submissions and a missing title screen reads as 'unfinished'. It needs a pause menu (Esc) with at least Resume, Restart, Quit. It needs a way to restart the game without quitting. These three screens take an afternoon if you build them last and an extra day if you forget about them until upload time.",
      ),

      h(2, "Tutorial in the first 30 seconds"),
      ps(
        "A jam judge will play your game for one to two minutes. If they don't understand the controls in the first thirty seconds, they will rate it down. Show controls on-screen, gate the first interaction behind a one-line prompt ('Press SPACE to jump'), and design the first level so the only correct action teaches the core mechanic. Don't write a wall of text — show, don't tell.",
      ),

      h(2, "Submission checklist"),
      ps(
        "Before you upload: run a clean build and play it from the title screen to a win and a loss. Take three or four screenshots that actually show gameplay (not your editor). Write a 2-3 sentence description with the verb-first hook. List controls explicitly in the description, even if they're in-game. Credit every asset and sound you used. Submit with at least an hour to spare — uploads fail, builds break, browsers crash. The team that ships ten minutes early always beats the team that 'just needs five more minutes' at the deadline.",
      ),
    ),
  },
];
