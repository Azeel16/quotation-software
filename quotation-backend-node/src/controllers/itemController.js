import Item from '../models/Item.js';

// @desc    Get all items
// @route   GET /api/items
// @access  Private
export const getItems = async (req, res, next) => {
  try {
    const { search = '', category = '' } = req.query;

    let query = { isActive: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) {
      query.category = category;
    }

    const items = await Item.find(query)
      .populate('category', 'name')
      .sort({ name: 1 });

    res.json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single item
// @route   GET /api/items/:id
// @access  Private
export const getItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id).populate('category', 'name');

    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Item not found',
      });
    }

    res.json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create item
// @route   POST /api/items
// @access  Private
export const createItem = async (req, res, next) => {
  try {
    const { name, price, category, description, unit } = req.body;

    const item = await Item.create({
      name,
      price,
      category,
      description,
      unit,
      createdBy: req.user.id,
    });

    await item.populate('category', 'name');

    res.status(201).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update item
// @route   PUT /api/items/:id
// @access  Private
export const updateItem = async (req, res, next) => {
  try {
    const { name, price, category, description, unit, isActive } = req.body;

    let item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Item not found',
      });
    }

    item = await Item.findByIdAndUpdate(
      req.params.id,
      { name, price, category, description, unit, isActive },
      { new: true, runValidators: true }
    ).populate('category', 'name');

    res.json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete item
// @route   DELETE /api/items/:id
// @access  Private
export const deleteItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Item not found',
      });
    }

    await item.deleteOne();

    res.json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
