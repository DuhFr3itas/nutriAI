from datetime import datetime
from sqlalchemy import Column, Integer, String, Numeric, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from app.database.connection import Base

class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True)
    age = Column(Integer)
    weight = Column(Numeric(5, 2))
    height = Column(Numeric(5, 2))
    goal = Column(String(255))
    created_at = Column(TIMESTAMP, default=datetime.utcnow)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    owner = relationship("User", back_populates="patients")

    diets = relationship("Diet", back_populates="patient")