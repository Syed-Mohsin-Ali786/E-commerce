const NewsLetter = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-2 pt-8 pb-14">
      <h1 className="md:text-4xl text-2xl font-medium">
        Get deals in your inbox
      </h1>
      <p className="md:text-base text-gray-500/80 pb-8 max-w-lg">
        Subscribe for new arrivals, exclusive offers, and order updates. No
        spam — unsubscribe anytime.
      </p>
      <form
        className="flex items-center justify-between max-w-2xl w-full md:h-14 h-12"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          className="border border-gray-500/30 rounded-md h-full border-r-0 outline-none w-full rounded-r-none px-3 text-gray-500"
          type="email"
          placeholder="Enter your email"
          aria-label="Email for newsletter"
        />
        <button
          type="submit"
          className="md:px-12 px-8 h-full text-white bg-orange-600 rounded-md rounded-l-none hover:bg-orange-700 transition"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
};

export default NewsLetter;
