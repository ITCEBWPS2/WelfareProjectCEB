import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const ViewEmployeeById = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await fetch(`http://localhost:8070/api/v1/employee/viewEmployee/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch employee");

        const htmlContent = `
          <div style="text-align:left; font-family: Arial, sans-serif; color:#333; line-height:1.5;">
            <h3 style="color:#f97316; margin-bottom:4px;">Personal Information</h3>
            <p><strong>Salutation:</strong> ${data.salutation || "-"}</p>
            <p><strong>Name with Initials:</strong> ${data.name || "-"}</p>
            <p><strong>Email:</strong> ${data.email || "-"}</p>
            <p><strong>Date of Birth:</strong> ${data.dateOfBirth?.slice(0,10) || "-"}</p>
            <p><strong>WhatsApp Number:</strong> ${data.whatsappNumber || "-"}</p>
            <p><strong>Contact Number:</strong> ${data.contactNumber || "-"}</p>
            <hr/>

            <h3 style="color:#f97316; margin-bottom:4px;">Work Information</h3>
            <p><strong>EPF Number:</strong> ${data.epfNumber || "-"}</p>
            <p><strong>Date Joined:</strong> ${data.dateJoined?.slice(0,10) || "-"}</p>
            <p><strong>Date Registered:</strong> ${data.dateRegistered?.slice(0,10) || "-"}</p>
            <p><strong>Welfare Number:</strong> ${data.welfareNumber || "-"}</p>
            <p><strong>Role:</strong> ${data.role || "-"}</p>
            <p><strong>Payroll:</strong> ${data.payroll || "-"}</p>
            <p><strong>Division:</strong> ${data.division || "-"}</p>
            <p><strong>Branch:</strong> ${data.branch || "-"}</p>
            <p><strong>Unit:</strong> ${data.unit || "-"}</p>
            <hr/>

            <h3 style="color:#f97316; margin-bottom:4px;">Spouse Information</h3>
            <p><strong>Name:</strong> ${data.spouse?.name || "-"}</p>
            <p><strong>Date of Birth:</strong> ${data.spouse?.dateOfBirth?.slice(0,10) || "-"}</p>
            <hr/>

            <h3 style="color:#f97316; margin-bottom:4px;">Children</h3>
            ${data.children?.length
              ? data.children.map(c => `<p>👶 ${c.name || "-"} | ${c.gender || "-"} | ${c.dateOfBirth?.slice(0,10) || "-"}</p>`).join('')
              : '<p>No children information available.</p>'
            }
            <hr/>

            <h3 style="color:#f97316; margin-bottom:4px;">Parents</h3>
            <p><strong>Mother:</strong> ${data.mother?.name || "-"} | DOB: ${data.mother?.dateOfBirth?.slice(0,10) || "-"}</p>
            <p><strong>Father:</strong> ${data.father?.name || "-"} | DOB: ${data.father?.dateOfBirth?.slice(0,10) || "-"}</p>
            <p><strong>Mother-in-Law:</strong> ${data.motherInLaw?.name || "-"} | DOB: ${data.motherInLaw?.dateOfBirth?.slice(0,10) || "-"}</p>
            <p><strong>Father-in-Law:</strong> ${data.fatherInLaw?.name || "-"} | DOB: ${data.fatherInLaw?.dateOfBirth?.slice(0,10) || "-"}</p>
          </div>
        `;

        Swal.fire({
          title: `Employee: ${data.name || "-"}`,
          html: htmlContent,
          showCloseButton: true,
          confirmButtonText: 'Close',
          width: '650px',
          scrollbarPadding: false,
        }).then(() => {
          // Navigate back to Manage Employees -> View Employees section
          navigate('/manageEmployees', { state: { section: 'viewEmployees' } });
        });

      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.message,
          confirmButtonText: 'Close'
        }).then(() => {
          navigate('/manageEmployees#viewEmployee');
        });
      }
    };

    fetchEmployee();
  }, [id, navigate]);

  return null;
};

export default ViewEmployeeById;
