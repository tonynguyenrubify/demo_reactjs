class Book < ActiveRecord::Base
  attr_accessible :author, :description, :title
  validates_presence_of :author, :description
  def as_json(options={})
    {
      id: id,
      author: author,
      description: description
    }
  end
end
