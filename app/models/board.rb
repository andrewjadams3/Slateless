class Board < ActiveRecord::Base
  belongs_to :user
  validates :url, presence: true, uniqueness: true
  validates :title, presence: true
end
