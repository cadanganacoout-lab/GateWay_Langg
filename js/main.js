(function () {
  "use strict";

  var THREE = window.THREE;
  var data = window.gatewayData || {};
  var links = Array.isArray(data.links) ? data.links : [];
  var sceneState = {
    renderer: null,
    camera: null,
    portal: null,
    outerShell: null,
    innerShell: null,
    core: null,
    drag: null,
  };

  function element(id) {
    var node = document.getElementById(id);
    if (!node) throw new Error("Missing required page element: #" + id);
    return node;
  }

  function safeUrl(value) {
    try {
      var url = new URL(value, window.location.href);
      return url.protocol === "http:" || url.protocol === "https:" ? url.href : "#";
    } catch (error) {
      return "#";
    }
  }

  function renderDestinations() {
    var list = element("destinationList");
    list.replaceChildren();
    element("destinationCount").textContent =
      String(links.length).padStart(2, "0") + " CONNECTIONS";

    links.forEach(function (link, index) {
      var anchor = document.createElement("a");
      var number = document.createElement("span");
      var copy = document.createElement("span");
      var label = document.createElement("strong");
      var description = document.createElement("small");
      var arrow = document.createElement("span");

      anchor.className = "destination-link";
      anchor.href = safeUrl(link.url);
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
      anchor.setAttribute("aria-label", "Buka " + link.label + " di tab baru");
      anchor.style.setProperty("--accent", link.color || "#8cf5e5");
      number.className = "destination-index";
      number.textContent = String(index + 1).padStart(2, "0");
      copy.className = "destination-copy";
      label.textContent = link.label || "DESTINATION";
      description.textContent = link.description || "";
      arrow.className = "destination-arrow";
      arrow.setAttribute("aria-hidden", "true");
      arrow.textContent = "↗";
      copy.append(label, description);
      anchor.append(number, copy, arrow);
      list.appendChild(anchor);
    });

    if (!links.length) {
      list.textContent = "Belum ada tautan tujuan.";
      element("systemStatus").textContent = "NO DESTINATIONS";
    }
  }

  function addStarField(scene) {
    var positions = [];
    var colors = [];
    for (var i = 0; i < 1800; i += 1) {
      var radius = 12 + Math.random() * 30;
      var theta = Math.random() * Math.PI * 2;
      var phi = Math.acos(2 * Math.random() - 1);
      positions.push(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta),
      );
      var tint = i % 6 === 0 ? [0.6, 0.7, 1] : [0.58, 1, 0.94];
      var brightness = 0.36 + Math.random() * 0.64;
      colors.push(tint[0] * brightness, tint[1] * brightness, tint[2] * brightness);
    }
    var geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    scene.add(new THREE.Points(
      geometry,
      new THREE.PointsMaterial({
        size: 0.035,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        sizeAttenuation: true
      }),
    ));
  }

  function makeGlowTexture() {
    var canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    var context = canvas.getContext("2d");
    var gradient = context.createRadialGradient(64, 64, 1, 64, 64, 64);
    gradient.addColorStop(0, "rgba(134, 255, 239, 0.95)");
    gradient.addColorStop(0.12, "rgba(75, 231, 223, 0.58)");
    gradient.addColorStop(0.4, "rgba(93, 139, 255, 0.16)");
    gradient.addColorStop(1, "rgba(76, 102, 255, 0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(canvas);
  }

  function addPortal(scene) {
    var portal = new THREE.Group();
    var shell = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.55, 3),
      new THREE.MeshBasicMaterial({
        color: 0x69f8e5,
        wireframe: true,
        transparent: true,
        opacity: 0.3
      }),
    );
    var innerShell = new THREE.Mesh(
      new THREE.SphereGeometry(1.38, 28, 20),
      new THREE.MeshBasicMaterial({
        color: 0x637cff,
        wireframe: true,
        transparent: true,
        opacity: 0.12
      }),
    );
    var core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.57, 2),
      new THREE.MeshBasicMaterial({
        color: 0xa4fff3,
        transparent: true,
        opacity: 0.94
      }),
    );
    sceneState.outerShell = shell;
    sceneState.innerShell = innerShell;
    sceneState.core = core;
    var marker = new THREE.Group();
    marker.position.set(0.94, 0.34, 1.04);
    var markerPlanet = new THREE.Mesh(
      new THREE.SphereGeometry(0.13, 20, 20),
      new THREE.MeshBasicMaterial({ color: 0xd0a5ff }),
    );
    var markerRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.21, 0.018, 6, 40),
      new THREE.MeshBasicMaterial({
        color: 0xa58aff,
        transparent: true,
        opacity: 0.9
      }),
    );
    markerRing.rotation.x = 0.8;
    marker.add(markerPlanet, markerRing);
    var glow = new THREE.Sprite(new THREE.SpriteMaterial({
      map: makeGlowTexture(),
      color: 0x78fff0,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    }));
    glow.scale.set(5.7, 5.7, 1);
    portal.add(shell, innerShell, core, marker, glow);

    for (var ringIndex = 0; ringIndex < 3; ringIndex += 1) {
      var ring = new THREE.Mesh(
        new THREE.TorusGeometry(1.82 + ringIndex * 0.17, 0.009, 6, 120),
        new THREE.MeshBasicMaterial({
          color: ringIndex === 1 ? 0x9a82ff : 0x68f9e8,
          transparent: true,
          opacity: 0.48 - ringIndex * 0.08
        }),
      );
      ring.rotation.x = 0.55 + ringIndex * 0.42;
      ring.rotation.y = ringIndex * 0.68;
      portal.add(ring);
    }

    var particles = [];
    for (var particleIndex = 0; particleIndex < 280; particleIndex += 1) {
      var phi = Math.acos(1 - 2 * Math.random());
      var theta = Math.PI * 2 * Math.random();
      var radius = 1.51 + Math.random() * 0.12;
      particles.push(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta),
      );
    }
    var particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(particles, 3),
    );
    portal.add(new THREE.Points(
      particleGeometry,
      new THREE.PointsMaterial({
        color: 0xbafff6,
        size: 0.025,
        transparent: true,
        opacity: 0.86,
        blending: THREE.AdditiveBlending
      }),
    ));

    var satelliteColors = [0x8a9bff, 0x74f4db, 0xd29eff];
    links.slice(0, 3).forEach(function (_link, index) {
      var orbit = new THREE.Group();
      orbit.rotation.set(index * 0.9 + 0.5, index * 1.7, index * 0.4);
      var satellite = new THREE.Mesh(
        new THREE.SphereGeometry(0.105 + index * 0.025, 16, 16),
        new THREE.MeshBasicMaterial({
          color: satelliteColors[index],
          transparent: true,
          opacity: 0.95
        }),
      );
      satellite.position.set(2.28 + index * 0.19, 0, 0);
      var orbitLine = new THREE.Mesh(
        new THREE.TorusGeometry(2.28 + index * 0.19, 0.005, 4, 100),
        new THREE.MeshBasicMaterial({
          color: satelliteColors[index],
          transparent: true,
          opacity: 0.19
        }),
      );
      orbitLine.rotation.x = Math.PI / 2;
      portal.add(orbitLine, orbit);
      orbit.add(satellite);
      orbit.userData.speed = (index % 2 ? -1 : 1) * (0.17 + index * 0.04);
    });

    scene.add(portal);
    sceneState.portal = portal;
  }

  function initThree() {
    var canvasWrap = element("canvasWrap");
    if (!THREE) {
      canvasWrap.classList.add("is-fallback");
      canvasWrap.insertAdjacentHTML(
        "beforeend",
        '<p class="canvas-fallback">3D CORE UNAVAILABLE<br><small>Destination links are still ready below.</small></p>',
      );
      element("systemStatus").textContent = "2D MODE / LINKS READY";
      return;
    }

    try {
      var canvas = element("sceneCanvas");
      var renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
      renderer.setClearColor(0x000000, 0);
      sceneState.renderer = renderer;

      var scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x050913, 0.018);
      var camera = new THREE.PerspectiveCamera(37, 1, 0.1, 100);
      camera.position.set(0, 0.12, 9.2);
      camera.lookAt(0, 0, 0);
      sceneState.camera = camera;

      scene.add(new THREE.AmbientLight(0x5c89a2, 1.1));
      var keyLight = new THREE.PointLight(0x5ff9e5, 2.6, 14);
      keyLight.position.set(1.2, 1.4, 3);
      scene.add(keyLight);
      addStarField(scene);
      addPortal(scene);

      function resize() {
        var width = Math.max(canvasWrap.clientWidth, 1);
        var height = Math.max(canvasWrap.clientHeight, 1);
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.render(scene, camera);
      }
      resize();
      window.addEventListener("resize", resize);

      var previousTime = 0;
      function render(time) {
        var delta = Math.min((time - previousTime) / 1000, 0.05);
        previousTime = time;
        if (!document.hidden) {
          if (sceneState.portal) {
            sceneState.portal.rotation.y += delta * 0.48;
            sceneState.outerShell.rotation.y += delta * 0.32;
            sceneState.outerShell.rotation.x += delta * 0.13;
            sceneState.innerShell.rotation.y -= delta * 0.24;
            sceneState.innerShell.rotation.z += delta * 0.11;
            sceneState.core.rotation.y += delta * 0.82;
            sceneState.core.rotation.x += delta * 0.39;
            sceneState.portal.children.forEach(function (child) {
              if (child.userData.speed) child.rotation.y += delta * child.userData.speed;
            });
          }
          renderer.render(scene, camera);
        }
      }

      renderer.setAnimationLoop(render);

      canvas.addEventListener("pointerdown", function (event) {
        sceneState.drag = { x: event.clientX, y: event.clientY };
        canvas.setPointerCapture(event.pointerId);
      });
      canvas.addEventListener("pointermove", function (event) {
        if (sceneState.drag) {
          var dx = event.clientX - sceneState.drag.x;
          var dy = event.clientY - sceneState.drag.y;
          sceneState.portal.rotation.y += dx * 0.006;
          sceneState.portal.rotation.x = Math.max(
            -0.9,
            Math.min(0.9, sceneState.portal.rotation.x + dy * 0.006),
          );
          sceneState.drag.x = event.clientX;
          sceneState.drag.y = event.clientY;
        }
      });
      canvas.addEventListener("pointerup", function () { sceneState.drag = null; });
      canvas.addEventListener("pointercancel", function () { sceneState.drag = null; });
      document.addEventListener("visibilitychange", function () {
        if (!document.hidden) renderer.render(scene, camera);
      });
    } catch (error) {
      console.error("Unable to initialize the 3D gateway.", error);
      canvasWrap.classList.add("is-fallback");
      canvasWrap.insertAdjacentHTML(
        "beforeend",
        '<p class="canvas-fallback">3D CORE UNAVAILABLE<br><small>Destination links are still ready below.</small></p>',
      );
      element("systemStatus").textContent = "2D MODE / LINKS READY";
    }
  }

  function initialize() {
    var site = data.site || {};
    var profile = data.profile || {};
    if (site.title) document.title = site.title;
    if (site.description) element("gatewayDescription").textContent = site.description;
    if (profile.location) {
      element("profileLocation").textContent = profile.location.toUpperCase() + " — INDONESIA";
    }
    renderDestinations();
    initThree();

    window.setTimeout(function () {
      var loadingScreen = element("loadingScreen");
      loadingScreen.classList.add("is-leaving");
      window.setTimeout(function () {
        loadingScreen.hidden = true;
      }, 450);
    }, 6000);
  }

  initialize();
})();
