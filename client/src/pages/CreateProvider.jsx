export default function CreateProvider() {
  return (
    <div className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">For Provider</h1>
      <form className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
          />

          <textarea
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
          />

          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
          />

          <input
            type="text"
            placeholder="License"
            className="border p-3 rounded-lg"
            id="License Type"
            required
          />

          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="1"
                max="10"
                required
                className="border p-3 rounded-lg"
              />
              <div className="flex flex-col items-center">
                <p>Regular Fees</p>
                <span className="text-xs">($ per booking)</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="1"
                max="10"
                required
                className="border p-3 rounded-lg"
              />
              <div className="flex flex-col items-center">
                <p>Discount Fees</p>
                <span className="text-xs">($ per booking)</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover. pick image for showcase (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-85">
              Upload
            </button>
          </div>
          <button className="p-3 bg-slate-700 text-white rounded=lg uppercase hover:opacity-95 disabled:opacity-80">
            Create Provider
          </button>
        </div>
      </form>
    </div>
  );
}
