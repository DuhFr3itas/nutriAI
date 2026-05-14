from datetime import datetime
from sqlalchemy import Column, Integer, String, Numeric, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from app.database.connection import Base

class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
<<<<<<< HEAD
    email = Column(String(150), index=True)
=======
    email = Column(String(150), unique=True, index=True)
>>>>>>> 41cd1c6abc1bbc936acca7085f16d7be5ebed42f
    age = Column(Integer)
    weight = Column(Numeric(5, 2))
    height = Column(Numeric(5, 2))
    goal = Column(String(255))
    created_at = Column(TIMESTAMP, default=datetime.utcnow)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    owner = relationship("User", back_populates="patients")

<<<<<<< HEAD
    diets = relationship("Diet", back_populates="patient", cascade="all, delete-orphan")
=======
    diets = relationship("Diet", back_populates="patient")
>>>>>>> 41cd1c6abc1bbc936acca7085f16d7be5ebed42f
