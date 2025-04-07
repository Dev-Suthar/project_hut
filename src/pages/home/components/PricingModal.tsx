import PricingSection from "./PricingSection";

type Props = {
  closePricingModal: () => void;
};

const PricingModal = ({ closePricingModal }: Props) => {
  return (
    <div
      className="modal-overlay"
      onClick={closePricingModal}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        zIndex: 99999999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        paddingTop: "150px", // Increased padding-top to move modal further down
      }}
    >
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          backgroundColor: "#0E0E0E",
          borderRadius: "8px",
          border: "1px solid #2D2D2D",
          width: "98%",
          maxWidth: "1200px",
          zIndex: 100000000,
          marginTop: "4800px", // Increased margin-top to move modal further down
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "15px 20px",
            borderBottom: "1px solid #2D2D2D",
          }}
        >
          <h2
            style={{
              fontSize: "22px",
              fontWeight: 700,
              color: "#FFFFFF",
              margin: 0,
            }}
          >
            Choose Your Plan
          </h2>
          <button
            onClick={closePricingModal}
            style={{
              background: "transparent",
              border: "none",
              color: "#FFFFFF",
              fontSize: "28px",
              marginTop: "0", // Fixed the formatting here
              cursor: "pointer",
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ×
          </button>
        </div>
        <div style={{ padding: 0 }}>
          <PricingSection isModal={true} onContactClick={closePricingModal} />
        </div>
      </div>
    </div>
  );
};

export default PricingModal;
