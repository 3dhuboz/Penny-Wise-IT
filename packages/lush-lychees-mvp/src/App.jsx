import {
  BarChart3,
  Bell,
  Brain,
  CalendarDays,
  Camera,
  CheckCircle2,
  ChevronRight,
  DollarSign,
  Edit3,
  Facebook,
  Hash,
  Home,
  Image as ImageIcon,
  Instagram,
  Leaf,
  ListChecks,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Megaphone,
  MessageSquare,
  Minus,
  PackageCheck,
  PackagePlus,
  Phone,
  Plus,
  RotateCcw,
  Route,
  Save,
  Search,
  Send,
  Sparkles,
  Target,
  TimerReset,
  Truck,
  User,
  Wand2
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { deliveryRuns as seedDeliveryRuns, orchardBlocks, products as seedProducts, socialCampaigns } from "./data.js";
import { createInitialStore, demoPin, loadStore, resetStore, saveStore } from "./demoStore.js";

const money = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
  maximumFractionDigits: 0
});

function findRun(query, runs) {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return null;
  }

  return runs.find((run) =>
    run.suburbs.some((suburb) => normalized.includes(suburb) || suburb.includes(normalized))
  );
}

function createScoutResult(block, observation) {
  const note = observation.toLowerCase();
  const pestFlag = note.includes("spot") || note.includes("mark") || note.includes("bug") || note.includes("bird");
  const rainFlag = note.includes("rain") || note.includes("split");
  const harvestWindow = block.ready >= 80 ? "24-48 hours" : block.ready >= 70 ? "2-3 days" : "4-5 days";

  return {
    confidence: Math.min(96, block.ready + (pestFlag ? 3 : 8)),
    harvestWindow,
    quality: pestFlag
      ? "Separate marked clusters during picking and keep premium boxes to clean fruit."
      : "Fruit colour and cluster size are suitable for premium box planning.",
    followUp: rainFlag
      ? "Walk the low rows tomorrow morning and record any splitting before opening more delivery capacity."
      : "Recheck sample trees before the next cut-off and release boxes in small batches.",
    risk: pestFlag ? "Watch-list" : "Clear"
  };
}

function createSocialDraft({ campaign, run, block, platform }) {
  const platformLead =
    platform === "Instagram"
      ? "Fresh from the orchard:"
      : "Local lychee lovers, the next seasonal drop is nearly here.";

  const campaignLine = {
    "delivery-launch": `${run.name} delivery opens for ${run.date}, with orders closing ${run.cutOff}.`,
    "harvest-update": `${block.label} is sitting around ${block.ready}% colour-ready, so boxes are being released in careful batches.`,
    "farm-gate-weekend": "Farm-gate collection is the best way to make the most of the short lychee season.",
    "last-cutoff": `${run.name} orders close ${run.cutOff}, then the team picks to match the confirmed boxes.`,
    "storage-recipe": "Keep lychees chilled, peel just before eating, and try them with lime, mint, and crushed ice."
  }[campaign.id];

  const hashtags =
    platform === "Instagram"
      ? ["#LushLychees", "#CQProduce", "#FarmFresh", "#LycheeSeason", "#Rockhampton"]
      : ["#LushLychees", "#CentralQueensland", "#FarmGate"];

  return {
    caption: `${platformLead} ${campaignLine} Premium lychees are picked to order so every run stays fresh, local, and seasonal. ${campaign.callToAction}`,
    hashtags,
    imagePrompt: `Photorealistic ${platform.toLowerCase()} image for Lush Lychees: fresh red lychees in a timber crate, green orchard rows, bright Central Queensland summer light, no text overlay.`,
    schedule: [
      { slot: "Launch", time: "Today 6:30pm", goal: "Open orders and explain the delivery area." },
      { slot: "Reminder", time: "Cut-off morning 8:00am", goal: "Bring urgency before picking is planned." },
      { slot: "Proof", time: "Delivery day 7:30am", goal: "Show picked fruit, packing bench, and farm freshness." }
    ]
  };
}

function WorkflowCard({ icon: Icon, title, subtitle, detail, active, onClick }) {
  return (
    <button className={`workflow-card ${active ? "active" : ""}`} onClick={onClick} type="button">
      <span className="workflow-icon">
        <Icon size={21} />
      </span>
      <strong>{title}</strong>
      <small>{subtitle}</small>
      <em>{detail}</em>
    </button>
  );
}

function ProductButton({ product, selected, onClick }) {
  return (
    <button className={`product-card ${selected ? "selected" : ""}`} onClick={onClick} type="button">
      <span>{product.weight}</span>
      <strong>{product.name}</strong>
      <small>{product.description}</small>
      <b>{money.format(product.price)}</b>
    </button>
  );
}

function RunCard({ run, selected, onClick }) {
  const remaining = run.capacity - run.reserved;
  const percent = Math.round((run.reserved / run.capacity) * 100);

  return (
    <button className={`run-card ${selected ? "selected" : ""}`} onClick={onClick} type="button">
      <div>
        <strong>{run.name}</strong>
        <span>{run.date}</span>
      </div>
      <div className="capacity-line">
        <span>{remaining} boxes left</span>
        <b>{percent}% reserved</b>
      </div>
      <div className="capacity-bar" aria-hidden="true">
        <span style={{ width: `${percent}%` }} />
      </div>
    </button>
  );
}

function TextField({ icon: Icon, label, value, onChange, placeholder, type = "text" }) {
  return (
    <label className="text-field">
      <span>{label}</span>
      <div>
        {Icon && <Icon size={17} />}
        <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} type={type} />
      </div>
    </label>
  );
}

function AdminPanel({
  adminAuthed,
  setAdminAuthed,
  store,
  setStore,
  selectedRunId,
  setSelectedRunId,
  orderImpact
}) {
  const [pin, setPin] = useState("");
  const [adminTab, setAdminTab] = useState("overview");
  const [adminNotice, setAdminNotice] = useState("Backend ready. Place a demo order, edit a run, or save a SocialAI draft.");
  const selectedRun = store.runs.find((run) => run.id === selectedRunId) ?? store.runs[0];
  const activeOrders = store.orders.filter((order) => order.status !== "Waitlist");
  const waitlistOrders = store.orders.filter((order) => order.status === "Waitlist");
  const reservedBoxes = activeOrders.reduce((sum, order) => sum + order.quantity, 0);
  const projectedRevenue = store.orders.reduce((sum, order) => sum + order.total, 0);

  const logActivity = (message) => {
    setAdminNotice(message);
    setStore((current) => ({
      ...current,
      activityLog: [message, ...current.activityLog].slice(0, 8)
    }));
  };

  const updateRun = (runId, patch) => {
    setStore((current) => ({
      ...current,
      runs: current.runs.map((run) => (run.id === runId ? { ...run, ...patch } : run))
    }));
  };

  const updateProduct = (productId, patch) => {
    setStore((current) => ({
      ...current,
      products: current.products.map((product) => (product.id === productId ? { ...product, ...patch } : product))
    }));
  };

  const updateOrderStatus = (orderId, status) => {
    setStore((current) => ({
      ...current,
      orders: current.orders.map((order) => (order.id === orderId ? { ...order, status } : order)),
      activityLog: [`${orderId} marked ${status}.`, ...current.activityLog].slice(0, 8)
    }));
    setAdminNotice(`${orderId} marked ${status}.`);
  };

  const resetDemoData = () => {
    resetStore();
    setStore(createInitialStore(seedProducts, seedDeliveryRuns));
  };

  if (!adminAuthed) {
    return (
      <section className="admin-login">
        <div>
          <Lock size={30} />
          <h2>Farm admin backend</h2>
          <p>
            Private demo login for Lush Lychees. This is the control room for runs, capacity, packing,
            orders, customer messages, and SocialAI content.
          </p>
          <div className="demo-pin">Demo PIN: {demoPin}</div>
          <label>
            <span>Enter PIN</span>
            <input value={pin} onChange={(event) => setPin(event.target.value)} placeholder="4702" type="password" />
          </label>
          <button
            className="primary-action"
            onClick={() => {
              if (pin === demoPin || pin.trim() === "") {
                setAdminAuthed(true);
              }
            }}
            type="button"
          >
            <Lock size={18} />
            Open admin backend
          </button>
          <small>For the owner demo, leaving it blank also opens admin so she cannot get stuck.</small>
        </div>
      </section>
    );
  }

  return (
    <section className="admin-shell">
      <div className="admin-topbar">
        <div>
          <h2>Lush Lychees admin backend</h2>
          <p>Owner backend for orders, delivery runs, box pricing, driver handoff, customer comms, and SocialAI calendar.</p>
        </div>
        <div className="admin-actions">
          <button className="secondary-action" onClick={resetDemoData} type="button">
            <RotateCcw size={17} />
            Reset demo data
          </button>
          <button className="secondary-action" onClick={() => setAdminAuthed(false)} type="button">
            <LogOut size={17} />
            Lock
          </button>
        </div>
      </div>

      <div className="owner-roi-panel">
        <div>
          <span>Demo impact estimate</span>
          <strong>6-10 admin hours returned weekly</strong>
          <p>Compared with today's manual DMs and spreadsheet sorting: customers self-check suburbs, cut-offs, capacity, and packing groups.</p>
        </div>
        <div>
          <span>Demo impact estimate</span>
          <strong>40-60 delivery questions answered first</strong>
          <p>Compared with today's inbox workflow: customers answer "do you deliver to me?" before they message the farm.</p>
        </div>
        <div>
          <span>Demo impact estimate</span>
          <strong>{money.format(orderImpact)} demand captured in demo</strong>
          <p>Orders and waitlist leads become structured demand instead of being lost across Messenger, calls, and inboxes.</p>
        </div>
        <div>
          <span>Driver app handoff</span>
          <strong>Route stops from confirmed orders</strong>
          <p>The same orders become driver stops with address, contact, notes, and delivery status instead of a printed spreadsheet.</p>
        </div>
      </div>

      <div className="admin-tabs" aria-label="Admin sections">
        {[
          ["overview", "Dashboard", BarChart3],
          ["orders", "Orders", ListChecks],
          ["runs", "Delivery runs", Truck],
          ["products", "Boxes", PackagePlus],
          ["comms", "Comms + SocialAI", MessageSquare]
        ].map(([key, label, Icon]) => (
          <button className={adminTab === key ? "active" : ""} key={key} onClick={() => setAdminTab(key)} type="button">
            <Icon size={17} />
            {label}
          </button>
        ))}
      </div>

      <div className="admin-notice">
        <CheckCircle2 size={18} />
        <span>{adminNotice}</span>
      </div>

      {adminTab === "overview" && (
        <div className="admin-grid">
          <div className="admin-card">
            <span>Orders</span>
            <strong>{activeOrders.length}</strong>
            <p>{reservedBoxes} boxes reserved across open runs.</p>
          </div>
          <div className="admin-card">
            <span>Waitlist</span>
            <strong>{waitlistOrders.length}</strong>
            <p>New suburb demand captured for future delivery decisions.</p>
          </div>
          <div className="admin-card">
            <span>Demo revenue</span>
            <strong>{money.format(projectedRevenue)}</strong>
            <p>Placeholder total from captured demo orders.</p>
          </div>
          <div className="admin-card">
            <span>Next cut-off</span>
            <strong>{selectedRun.cutOff}</strong>
            <p>{selectedRun.name} closes before picking and packing are confirmed.</p>
          </div>
        </div>
      )}

      {adminTab === "orders" && (
        <div className="admin-card wide">
          <div className="admin-card-heading">
            <div>
              <h3>Live demo orders</h3>
              <p>Place an order on the customer side, then it appears here for packing and delivery.</p>
            </div>
          </div>
          <div className="orders-table">
            {store.orders.map((order) => (
              <article className="order-row" key={order.id}>
                <div>
                  <strong>{order.ref}</strong>
                  <span>{order.customerName} - {order.suburb}</span>
                </div>
                <div>
                  <strong>{order.quantity} x {order.productName}</strong>
                  <span>{order.runName} - {money.format(order.total)}</span>
                </div>
                <div className={`status-chip ${order.status.toLowerCase()}`}>{order.status}</div>
                <div className="row-actions">
                  {["Reserved", "Packed", "Delivered"].map((status) => (
                    <button key={status} onClick={() => updateOrderStatus(order.id, status)} type="button">
                      {status}
                    </button>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {adminTab === "runs" && (
        <div className="admin-split">
          <div className="admin-card">
            <h3>Open delivery runs</h3>
            <div className="run-list compact">
              {store.runs.map((run) => (
                <RunCard key={run.id} run={run} selected={run.id === selectedRunId} onClick={() => setSelectedRunId(run.id)} />
              ))}
            </div>
          </div>
          <div className="admin-card">
            <h3>Edit selected run</h3>
            <div className="admin-form-grid">
              <TextField label="Run name" value={selectedRun.name} onChange={(value) => updateRun(selectedRun.id, { name: value })} />
              <TextField label="Delivery date" value={selectedRun.date} onChange={(value) => updateRun(selectedRun.id, { date: value })} />
              <TextField label="Cut-off" value={selectedRun.cutOff} onChange={(value) => updateRun(selectedRun.id, { cutOff: value })} />
              <TextField
                label="Delivery fee"
                type="number"
                value={String(selectedRun.fee)}
                onChange={(value) => updateRun(selectedRun.id, { fee: Number(value) || 0 })}
              />
              <TextField
                label="Capacity"
                type="number"
                value={String(selectedRun.capacity)}
                onChange={(value) => updateRun(selectedRun.id, { capacity: Number(value) || 0 })}
              />
              <TextField
                label="Reserved boxes"
                type="number"
                value={String(selectedRun.reserved)}
                onChange={(value) => updateRun(selectedRun.id, { reserved: Number(value) || 0 })}
              />
            </div>
            <label className="note-field">
              <span>Suburbs / postcodes</span>
              <textarea
                value={selectedRun.suburbs.join(", ")}
                onChange={(event) => updateRun(selectedRun.id, { suburbs: event.target.value.split(",").map((item) => item.trim().toLowerCase()).filter(Boolean) })}
                rows={3}
              />
            </label>
            <button className="secondary-action full" onClick={() => logActivity(`${selectedRun.name} delivery settings saved.`)} type="button">
              <Save size={18} />
              Save run settings
            </button>
          </div>
        </div>
      )}

      {adminTab === "products" && (
        <div className="admin-card wide">
          <h3>Lychee boxes and pricing</h3>
          <div className="product-editor-grid">
            {store.products.map((product) => (
              <article className="product-editor" key={product.id}>
                <strong>{product.name}</strong>
                <TextField label="Price" type="number" value={String(product.price)} onChange={(value) => updateProduct(product.id, { price: Number(value) || 0 })} />
                <TextField label="Weight" value={product.weight} onChange={(value) => updateProduct(product.id, { weight: value })} />
                <label className="note-field">
                  <span>Description</span>
                  <textarea value={product.description} onChange={(event) => updateProduct(product.id, { description: event.target.value })} rows={3} />
                </label>
              </article>
            ))}
          </div>
        </div>
      )}

      {adminTab === "comms" && (
        <div className="admin-split">
          <div className="admin-card">
            <h3>Customer update preview</h3>
            <div className="message-preview">
              <Bell size={20} />
              <p>
                Hi from Lush Lychees. {selectedRun.name} delivery is open for {selectedRun.date}.
                Orders close {selectedRun.cutOff}. Reserve your box before picking is planned.
              </p>
            </div>
            <button className="primary-action full" onClick={() => logActivity(`${selectedRun.name} customer update drafted.`)} type="button">
              <Send size={18} />
              Draft SMS/email update
            </button>
          </div>
          <div className="admin-card">
            <h3>SocialAI calendar</h3>
            {store.socialCalendar.length ? (
              <div className="calendar-list">
                {store.socialCalendar.map((item) => (
                  <article key={item.id}>
                    <strong>{item.platform} - {item.campaign}</strong>
                    <span>{item.caption}</span>
                  </article>
                ))}
              </div>
            ) : (
              <p className="empty-copy">Generate a SocialAI draft and save it to the calendar to prove the marketing loop.</p>
            )}
            <h3>Activity log</h3>
            <div className="activity-list">
              {store.activityLog.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function App() {
  const [store, setStore] = useState(() => loadStore(seedProducts, seedDeliveryRuns));
  const [activeView, setActiveView] = useState("customer");
  const [query, setQuery] = useState("Yeppoon");
  const [selectedProductId, setSelectedProductId] = useState("three-kg");
  const [quantity, setQuantity] = useState(1);
  const [selectedRunId, setSelectedRunId] = useState("capricorn-coast");
  const [selectedBlockId, setSelectedBlockId] = useState("ridge-c");
  const [rowNote, setRowNote] = useState("Deep blush on outer clusters, clean skin, a few small bird marks near row 22.");
  const [scoutResult, setScoutResult] = useState(null);
  const [selectedCampaignId, setSelectedCampaignId] = useState("delivery-launch");
  const [selectedPlatform, setSelectedPlatform] = useState("Instagram");
  const [socialDraft, setSocialDraft] = useState(null);
  const [adminAuthed, setAdminAuthed] = useState(false);
  const [customer, setCustomer] = useState({
    name: "Demo customer",
    mobile: "0400 000 000",
    email: "hello@example.com",
    address: "Yeppoon QLD"
  });
  const [orderResult, setOrderResult] = useState(null);

  useEffect(() => {
    saveStore(store);
  }, [store]);

  const products = store.products;
  const runs = store.runs;
  const matchedRun = useMemo(() => findRun(query, runs), [query, runs]);
  const selectedProduct = products.find((product) => product.id === selectedProductId) ?? products[0];
  const selectedRun = runs.find((run) => run.id === selectedRunId) ?? runs[0];
  const selectedBlock = orchardBlocks.find((block) => block.id === selectedBlockId) ?? orchardBlocks[0];
  const selectedCampaign = socialCampaigns.find((campaign) => campaign.id === selectedCampaignId) ?? socialCampaigns[0];
  const itemTotal = selectedProduct.price * quantity;
  const deliveryFee = matchedRun ? matchedRun.fee : 0;
  const orderTotal = itemTotal + deliveryFee;
  const orderImpact = store.orders.reduce((sum, order) => sum + order.total, 0);
  const driverOrders = store.orders.filter((order) => order.runId === selectedRun.id && order.status !== "Waitlist");
  const driverDelivered = driverOrders.filter((order) => order.status === "Delivered").length;

  const increaseCapacity = () => {
    setStore((current) => ({
      ...current,
      runs: current.runs.map((run) => {
        if (run.id !== selectedRun.id) return run;

        return {
          ...run,
          reserved: Math.min(run.capacity, run.reserved + 6),
          orders: run.reserved + 6 <= run.capacity ? run.orders + 2 : run.orders
        };
      }),
      activityLog: [`${selectedRun.name} sample orders added to demonstrate capacity.`, ...current.activityLog].slice(0, 8)
    }));
  };

  const runScout = () => {
    setScoutResult(createScoutResult(selectedBlock, rowNote));
  };

  const generateSocialDraft = () => {
    setSocialDraft(createSocialDraft({ campaign: selectedCampaign, run: selectedRun, block: selectedBlock, platform: selectedPlatform }));
  };

  const saveSocialDraft = () => {
    if (!socialDraft) return;

    setStore((current) => ({
      ...current,
      socialCalendar: [
        {
          id: `social-${Date.now()}`,
          platform: selectedPlatform,
          campaign: selectedCampaign.name,
          caption: socialDraft.caption,
          createdAt: "Just now"
        },
        ...current.socialCalendar
      ],
      activityLog: [`${selectedCampaign.name} saved to SocialAI calendar.`, ...current.activityLog].slice(0, 8)
    }));
  };

  const updateDriverOrder = (orderId, status) => {
    const order = store.orders.find((item) => item.id === orderId);
    setStore((current) => ({
      ...current,
      orders: current.orders.map((item) => (item.id === orderId ? { ...item, status } : item)),
      activityLog: order ? [`Driver marked ${order.ref} ${status.toLowerCase()}.`, ...current.activityLog].slice(0, 8) : current.activityLog
    }));
  };

  const notifyDriverRun = () => {
    setStore((current) => ({
      ...current,
      activityLog: [`Driver SMS draft prepared for ${selectedRun.name}.`, ...current.activityLog].slice(0, 8)
    }));
  };

  const submitOrder = () => {
    const runForOrder = matchedRun;
    const ref = runForOrder ? `LL-${Math.floor(1100 + Math.random() * 800)}` : `WAIT-${Math.floor(300 + Math.random() * 600)}`;
    const newOrder = {
      id: `order-${Date.now()}`,
      ref,
      customerName: customer.name || "Demo customer",
      mobile: customer.mobile || "Not supplied",
      email: customer.email || "Not supplied",
      address: customer.address || query,
      suburb: query,
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      quantity,
      deliveryFee,
      itemTotal,
      total: runForOrder ? orderTotal : itemTotal,
      runId: runForOrder?.id ?? null,
      runName: runForOrder?.name ?? "Waitlist",
      status: runForOrder ? "Reserved" : "Waitlist",
      notes: runForOrder ? "Customer created from demo checkout." : "Customer wants delivery if this suburb is opened.",
      createdAt: "Just now"
    };

    setStore((current) => ({
      ...current,
      orders: [newOrder, ...current.orders],
      runs: current.runs.map((run) => {
        if (!runForOrder || run.id !== runForOrder.id) return run;

        return {
          ...run,
          reserved: Math.min(run.capacity, run.reserved + quantity),
          orders: run.orders + 1,
          packingTotals: {
            ...run.packingTotals,
            [selectedProduct.name]: (run.packingTotals[selectedProduct.name] || 0) + quantity
          }
        };
      }),
      activityLog: [`${newOrder.ref} captured from customer checkout.`, ...current.activityLog].slice(0, 8)
    }));
    setOrderResult(newOrder);
  };

  return (
    <div className="app">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Lush Lychees home">
          <span className="brand-mark">
            <Leaf size={22} />
          </span>
          <span>
            <strong>Lush Lychees</strong>
            <small>Delivery Studio</small>
          </span>
        </a>
        <nav aria-label="Primary">
          <button className={activeView === "customer" ? "active" : ""} onClick={() => setActiveView("customer")} type="button">
            <Search size={17} />
            Sell
          </button>
          <button className={activeView === "driver" || activeView === "planner" ? "active" : ""} onClick={() => setActiveView("driver")} type="button">
            <Truck size={17} />
            Deliver
          </button>
          <button className={activeView === "admin" ? "active" : ""} onClick={() => setActiveView("admin")} type="button">
            <Lock size={17} />
            Manage
          </button>
          <button className={activeView === "social" || activeView === "scout" ? "active" : ""} onClick={() => setActiveView("social")} type="button">
            <Megaphone size={17} />
            SocialAI
          </button>
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <h1>One app for the whole lychee season.</h1>
            <p>
              Lush Lychees can sell boxes, manage delivery runs, guide drivers, and publish seasonal social content from one simple workflow.
            </p>
            <div className="owner-note">
              <strong>Not just a selling tool:</strong>
              <span>the same order becomes a packing total, driver stop, admin record, customer update, and SocialAI campaign prompt.</span>
            </div>
            <div className="hero-actions">
              <button className="primary-action" onClick={() => setActiveView("customer")} type="button">
                <MapPin size={18} />
                Customer ordering
              </button>
              <button className="secondary-action" onClick={() => setActiveView("driver")} type="button">
                <Truck size={18} />
                Driver app
              </button>
              <button className="secondary-action" onClick={() => setActiveView("admin")} type="button">
                <Lock size={18} />
                Owner backend
              </button>
            </div>
          </div>
          <div className="hero-media">
            <img src="/lychee-orchard-hero.png" alt="Fresh lychees in a timber crate at the orchard" />
            <div className="season-panel">
              <span>Season status</span>
              <strong>Pre-orders open</strong>
              <small>Farm gate, collection points, and local delivery runs</small>
            </div>
          </div>
        </section>

        <section className="workflow-grid" aria-label="What the app includes">
          <WorkflowCard
            active={activeView === "customer"}
            detail="Suburb checker, box reservation, waitlist capture."
            icon={Search}
            onClick={() => setActiveView("customer")}
            subtitle="Customers reserve only where a run is open."
            title="Sell"
          />
          <WorkflowCard
            active={activeView === "driver" || activeView === "planner"}
            detail="Stops, phone numbers, notes, delivery status."
            icon={Truck}
            onClick={() => setActiveView("driver")}
            subtitle="Drivers see the run without a messy spreadsheet."
            title="Deliver"
          />
          <WorkflowCard
            active={activeView === "admin"}
            detail="Orders, cut-offs, capacity, products, comms."
            icon={Lock}
            onClick={() => setActiveView("admin")}
            subtitle="The owner controls the season from one backend."
            title="Manage"
          />
          <WorkflowCard
            active={activeView === "social" || activeView === "scout"}
            detail="SocialAI drafts plus harvest-aware content prompts."
            icon={Megaphone}
            onClick={() => setActiveView("social")}
            subtitle="Turn delivery runs and orchard notes into posts."
            title="Market"
          />
        </section>

        <section className="benefit-band" aria-label="Delivery benefits">
          <div>
            <TimerReset size={22} />
            <strong>6-10 admin hours returned each week</strong>
            <span>Customers self-check delivery areas and cut-offs; captured orders build packing totals automatically.</span>
          </div>
          <div>
            <MessageSquare size={22} />
            <strong>40-60 questions answered before they message</strong>
            <span>The app answers "do you deliver to me?" before a DM, call, or Facebook message reaches the farm.</span>
          </div>
          <div>
            <DollarSign size={22} />
            <strong>{money.format(orderImpact)} demand captured in demo</strong>
            <span>Orders and waitlist leads become a delivery list for the owner and driver, not scattered inbox notes.</span>
          </div>
        </section>

        {activeView === "customer" && (
          <section className="workspace customer-workspace">
            <div className="workspace-main">
              <div className="section-heading">
                <h2>Delivery area check</h2>
                <p>Local suburbs map to the next available delivery run or collection fallback.</p>
              </div>

              <label className="search-field">
                <Search size={20} />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Enter suburb or postcode"
                  type="text"
                />
              </label>

              <div className={`match-panel ${matchedRun ? "match" : "waitlist"}`}>
                {matchedRun ? (
                  <>
                    <CheckCircle2 size={24} />
                    <div>
                      <strong>{matchedRun.name} run available</strong>
                      <span>
                        Delivery on {matchedRun.date}. Order cut-off is {matchedRun.cutOff}. Delivery fee is{" "}
                        {money.format(matchedRun.fee)}.
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <MapPin size={24} />
                    <div>
                      <strong>Waitlist or farm-gate collection</strong>
                      <span>
                        This suburb is not on an open run yet. Capture the request and release capacity if enough nearby orders build up.
                      </span>
                    </div>
                  </>
                )}
              </div>

              <div className="product-grid">
                {products.map((product) => (
                  <ProductButton
                    key={product.id}
                    product={product}
                    selected={product.id === selectedProductId}
                    onClick={() => setSelectedProductId(product.id)}
                  />
                ))}
              </div>
            </div>

            <aside className="summary-panel">
              <h2>Pre-order summary</h2>
              <dl>
                <div>
                  <dt>Box</dt>
                  <dd>{selectedProduct.name}</dd>
                </div>
                <div>
                  <dt>Quantity</dt>
                  <dd>
                    <button onClick={() => setQuantity((current) => Math.max(1, current - 1))} type="button" aria-label="Decrease quantity">
                      <Minus size={16} />
                    </button>
                    <span>{quantity}</span>
                    <button onClick={() => setQuantity((current) => Math.min(20, current + 1))} type="button" aria-label="Increase quantity">
                      <Plus size={16} />
                    </button>
                  </dd>
                </div>
                <div>
                  <dt>Items</dt>
                  <dd>{money.format(itemTotal)}</dd>
                </div>
                <div>
                  <dt>Delivery</dt>
                  <dd>{matchedRun ? money.format(deliveryFee) : "TBC"}</dd>
                </div>
                <div className="total-row">
                  <dt>Total</dt>
                  <dd>{matchedRun ? money.format(orderTotal) : money.format(itemTotal)}</dd>
                </div>
              </dl>
              <div className="checkout-fields">
                <TextField
                  icon={User}
                  label="Customer name"
                  value={customer.name}
                  onChange={(value) => setCustomer((current) => ({ ...current, name: value }))}
                />
                <TextField
                  icon={Phone}
                  label="Mobile"
                  value={customer.mobile}
                  onChange={(value) => setCustomer((current) => ({ ...current, mobile: value }))}
                />
                <TextField
                  icon={Mail}
                  label="Email"
                  value={customer.email}
                  onChange={(value) => setCustomer((current) => ({ ...current, email: value }))}
                />
                <TextField
                  icon={Home}
                  label="Delivery address"
                  value={customer.address}
                  onChange={(value) => setCustomer((current) => ({ ...current, address: value }))}
                />
              </div>
              <button className="primary-action full" onClick={submitOrder} type="button">
                Reserve seasonal box
                <ChevronRight size={18} />
              </button>
              {orderResult && (
                <div className="confirmation-panel">
                  <CheckCircle2 size={21} />
                  <div>
                    <strong>{orderResult.ref} captured in admin</strong>
                    <span>
                      {orderResult.status === "Waitlist"
                        ? "This became a waitlist lead so the farm can measure delivery demand."
                        : "This order is now visible in the owner backend for packing and delivery."}
                    </span>
                  </div>
                </div>
              )}
              <p className="fine-print">Payments, SMS, and emails can plug into the production build after the run rules are approved.</p>
            </aside>
          </section>
        )}

        {activeView === "driver" && (
          <section className="workspace driver-workspace">
            <div className="workspace-main">
              <div className="section-heading">
                <h2>Driver delivery app</h2>
                <p>Every confirmed order becomes a simple stop list with route notes, customer contact, and delivery status.</p>
              </div>

              <div className="run-list compact driver-run-selector" aria-label="Choose driver run">
                {runs.map((run) => (
                  <RunCard key={run.id} run={run} selected={run.id === selectedRunId} onClick={() => setSelectedRunId(run.id)} />
                ))}
              </div>

              <div className="driver-stop-list">
                {driverOrders.length > 0 ? (
                  driverOrders.map((order, index) => (
                    <article className={`driver-stop ${order.status.toLowerCase()}`} key={order.id}>
                      <div className="stop-index">{index + 1}</div>
                      <div className="driver-stop-main">
                        <div>
                          <strong>{order.customerName}</strong>
                          <span>{order.address}</span>
                        </div>
                        <small>
                          {order.quantity} x {order.productName} · {order.notes}
                        </small>
                      </div>
                      <span className={`status-chip ${order.status.toLowerCase()}`}>{order.status}</span>
                      <div className="driver-stop-actions">
                        <a href={`tel:${order.mobile}`}>
                          <Phone size={15} />
                          Call
                        </a>
                        <button onClick={() => updateDriverOrder(order.id, "Packed")} type="button">
                          Packed
                        </button>
                        <button onClick={() => updateDriverOrder(order.id, "Delivered")} type="button">
                          Delivered
                        </button>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="empty-driver-state">
                    <Truck size={24} />
                    <strong>No stops on this run yet</strong>
                    <span>Place a demo order in an open suburb and it will appear here for the driver.</span>
                  </div>
                )}
              </div>
            </div>

            <aside className="driver-phone">
              <div className="driver-phone-header">
                <Truck size={22} />
                <div>
                  <h2>{selectedRun.name}</h2>
                  <p>{selectedRun.date} · closes {selectedRun.cutOff}</p>
                </div>
              </div>

              <div className="driver-summary">
                <div>
                  <span>Stops</span>
                  <strong>{driverOrders.length}</strong>
                </div>
                <div>
                  <span>Delivered</span>
                  <strong>{driverDelivered}</strong>
                </div>
                <div>
                  <span>Boxes</span>
                  <strong>{selectedRun.reserved}</strong>
                </div>
              </div>

              <div className="driver-checklist">
                <div>
                  <PackageCheck size={18} />
                  <span>Pack to confirmed order count before the driver leaves.</span>
                </div>
                <div>
                  <Route size={18} />
                  <span>Keep route suburbs, customer notes, and phone numbers in the same app.</span>
                </div>
                <div>
                  <Bell size={18} />
                  <span>Draft customer updates through ClickSend or Resend in production.</span>
                </div>
              </div>

              <button className="primary-action full" onClick={notifyDriverRun} type="button">
                <Send size={18} />
                Draft driver/customer update
              </button>
              <button className="secondary-action full" onClick={() => setActiveView("planner")} type="button">
                <Route size={18} />
                Open run planner
              </button>
            </aside>
          </section>
        )}

        {activeView === "planner" && (
          <section className="workspace planner-workspace">
            <div className="workspace-main">
              <div className="section-heading">
                <h2>Delivery run planner</h2>
                <p>Runs carry suburb lists, cut-offs, capacity, fees, and packing totals.</p>
              </div>
              <div className="run-list">
                {runs.map((run) => (
                  <RunCard key={run.id} run={run} selected={run.id === selectedRunId} onClick={() => setSelectedRunId(run.id)} />
                ))}
              </div>
            </div>

            <aside className="planner-detail">
              <h2>{selectedRun.name}</h2>
              <div className="detail-meta">
                <span>
                  <CalendarDays size={16} />
                  {selectedRun.date}
                </span>
                <span>
                  <Truck size={16} />
                  {money.format(selectedRun.fee)} delivery
                </span>
              </div>
              <div className="capacity-large">
                <strong>{selectedRun.capacity - selectedRun.reserved}</strong>
                <span>boxes remaining before this run closes</span>
              </div>
              <button className="secondary-action full" onClick={increaseCapacity} type="button">
                <Plus size={18} />
                Add sample orders
              </button>
              <div className="suburb-list">
                {selectedRun.suburbs.slice(0, 5).map((suburb) => (
                  <span key={suburb}>{suburb}</span>
                ))}
              </div>
              <table>
                <caption>Packing totals</caption>
                <tbody>
                  {Object.entries(selectedRun.packingTotals).map(([box, count]) => (
                    <tr key={box}>
                      <td>{box}</td>
                      <td>{count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </aside>
          </section>
        )}

        {activeView === "scout" && (
          <section className="workspace scout-workspace">
            <div className="workspace-main">
              <div className="section-heading">
                <h2>AI Orchard Scout</h2>
                <p>Photo notes become harvest-window signals and packing guidance for the next delivery release.</p>
              </div>
              <div className="block-grid">
                {orchardBlocks.map((block) => (
                  <button
                    className={`block-card ${block.id === selectedBlockId ? "selected" : ""}`}
                    key={block.id}
                    onClick={() => {
                      setSelectedBlockId(block.id);
                      setScoutResult(null);
                    }}
                    type="button"
                  >
                    <span>{block.rows}</span>
                    <strong>{block.label}</strong>
                    <small>{block.variety}</small>
                    <b>{block.ready}% colour-ready</b>
                  </button>
                ))}
              </div>

              <label className="note-field">
                <span>Observation</span>
                <textarea value={rowNote} onChange={(event) => setRowNote(event.target.value)} rows={5} />
              </label>

              <button className="primary-action" onClick={runScout} type="button">
                <Camera size={18} />
                Assess orchard photo
              </button>
            </div>

            <aside className="scout-result">
              <div className="photo-placeholder">
                <Camera size={34} />
                <span>{selectedBlock.label}</span>
              </div>
              <h2>{selectedBlock.variety}</h2>
              <p>{selectedBlock.note}</p>
              {scoutResult ? (
                <div className="result-list">
                  <div>
                    <span>Ripeness confidence</span>
                    <strong>{scoutResult.confidence}%</strong>
                  </div>
                  <div>
                    <span>Harvest window</span>
                    <strong>{scoutResult.harvestWindow}</strong>
                  </div>
                  <div>
                    <span>Quality note</span>
                    <strong>{scoutResult.quality}</strong>
                  </div>
                  <div>
                    <span>Follow-up</span>
                    <strong>{scoutResult.followUp}</strong>
                  </div>
                </div>
              ) : (
                <div className="pending-result">
                  <Sparkles size={22} />
                  <span>Scout result ready when the latest block note is assessed.</span>
                </div>
              )}
            </aside>
          </section>
        )}

        {activeView === "social" && (
          <section className="workspace social-workspace">
            <div className="workspace-main">
              <div className="section-heading">
                <h2>SocialAI Studio</h2>
                <p>A social media tool for the farm: turn delivery runs, harvest notes, and box availability into ready-to-edit posts.</p>
              </div>

              <div className="social-command">
                <div className="social-intel-card">
                  <Brain size={22} />
                  <div>
                    <strong>Campaign context</strong>
                    <span>
                      Using {selectedRun.name}, {selectedRun.date}, {selectedBlock.label}, and {selectedBlock.variety}.
                    </span>
                  </div>
                </div>
                <div className="platform-toggle" aria-label="Choose platform">
                  {["Instagram", "Facebook"].map((platform) => {
                    const Icon = platform === "Instagram" ? Instagram : Facebook;
                    return (
                      <button
                        className={selectedPlatform === platform ? "active" : ""}
                        key={platform}
                        onClick={() => {
                          setSelectedPlatform(platform);
                          setSocialDraft(null);
                        }}
                        type="button"
                      >
                        <Icon size={17} />
                        {platform}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="campaign-grid">
                {socialCampaigns.map((campaign) => (
                  <button
                    className={`campaign-card ${campaign.id === selectedCampaignId ? "selected" : ""}`}
                    key={campaign.id}
                    onClick={() => {
                      setSelectedCampaignId(campaign.id);
                      setSocialDraft(null);
                    }}
                    type="button"
                  >
                    <span>{campaign.channelFit}</span>
                    <strong>{campaign.name}</strong>
                    <small>{campaign.hook}</small>
                  </button>
                ))}
              </div>

              <button className="primary-action social-generate" onClick={generateSocialDraft} type="button">
                <Wand2 size={18} />
                Generate Lush campaign
              </button>

              <div className="social-metrics" aria-label="SocialAI studio metrics">
                <div>
                  <BarChart3 size={18} />
                  <strong>Best window</strong>
                  <span>6:30pm local</span>
                </div>
                <div>
                  <Target size={18} />
                  <strong>Goal</strong>
                  <span>Sell boxes before cut-off</span>
                </div>
                <div>
                  <ImageIcon size={18} />
                  <strong>Asset</strong>
                  <span>Harvest photo prompt</span>
                </div>
              </div>
              <button className="secondary-action social-generate" onClick={() => setActiveView("scout")} type="button">
                <Camera size={18} />
                Open AI Orchard Scout
              </button>
            </div>

            <aside className="social-preview">
              <div className="social-preview-header">
                <Sparkles size={22} />
                <div>
                  <h2>Lush Lychees draft</h2>
                  <p>{selectedCampaign.name}</p>
                </div>
              </div>

              {socialDraft ? (
                <>
                  <div className="post-preview">
                    <div className="post-topline">
                      <span>{selectedPlatform}</span>
                      <b>Editable draft</b>
                    </div>
                    <p>{socialDraft.caption}</p>
                    <div className="hashtag-row">
                      {socialDraft.hashtags.map((tag) => (
                        <span key={tag}>
                          <Hash size={12} />
                          {tag.replace("#", "")}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="image-prompt">
                    <ImageIcon size={18} />
                    <span>{socialDraft.imagePrompt}</span>
                  </div>

                  <div className="schedule-stack">
                    {socialDraft.schedule.map((slot) => (
                      <div key={slot.slot}>
                        <strong>{slot.slot}</strong>
                        <span>{slot.time}</span>
                        <small>{slot.goal}</small>
                      </div>
                    ))}
                  </div>

                  <button className="secondary-action full" onClick={saveSocialDraft} type="button">
                    <Send size={18} />
                    Save to content calendar
                  </button>
                </>
              ) : (
                <div className="pending-result social-empty">
                  <Megaphone size={22} />
                  <span>Pick a campaign angle and generate the first Lush Lychees content draft.</span>
                </div>
              )}
            </aside>
          </section>
        )}

        {activeView === "admin" && (
          <AdminPanel
            adminAuthed={adminAuthed}
            setAdminAuthed={setAdminAuthed}
            store={store}
            setStore={setStore}
            selectedRunId={selectedRunId}
            setSelectedRunId={setSelectedRunId}
            orderImpact={orderImpact}
          />
        )}
      </main>
    </div>
  );
}

export default App;
